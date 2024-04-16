"use server";

import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { createTeamUser } from "./auth";
import { saveActivityLogsNotification } from "./notifications";

import { Role } from "@prisma/client";
import { logger } from "@/lib/utils";
import { changeUserPermissions } from "./permissions";

export const sendInvitation = async (
  name: string,
  role: Role,
  email: string,
  agencyId: string,
  subAccountId?: string
) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user?.role === role) {
    throw new Error("This user already have this role");
  }

  const resposne = await db.invitation.create({
    data: { name, email, agencyId, role, subAccountId },
  });

  try {
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/sign-up`,
      ignoreExisting: true,
      publicMetadata: {
        throughInvitation: true,
        role,
        subAccountId: subAccountId ? subAccountId : undefined,
      },
    });
  } catch (error: any) {
    console.error(error);
    throw error;
  }

  return resposne;
};

export const verifyInvitation = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  // check if user exist already to avoid duplicates users
  const isUserExist = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      permissions: true,
    },
  });

  if (isUserExist) {
    return {
      agencyId: isUserExist.agencyId,
      subAccountId:
        isUserExist.role === Role.SUBACCOUNT_USER
          ? isUserExist.permissions[0].subAccountId
          : null,
    };
  }

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      id: user.id,
      role: invitationExists.role,
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (userDetails) {
      await saveActivityLogsNotification({
        agencyId: invitationExists.agencyId,
        description: `${userDetails.name} Joined`,
        subAccountId: invitationExists.subAccountId
          ? invitationExists.subAccountId
          : undefined,
      });

      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || Role.SUBACCOUNT_USER,
        },
      });

      if (invitationExists.subAccountId) {
        await changeUserPermissions(
          uuidv4(),
          userDetails.email,
          invitationExists.subAccountId,
          true
        );
      }

      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return {
        agencyId: userDetails.agencyId,
        subAccountId: invitationExists.subAccountId
          ? invitationExists.subAccountId
          : null,
      };
    }

    return null;
  }

  return null;
};
