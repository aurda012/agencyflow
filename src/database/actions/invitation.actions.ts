"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "..";
import User from "../models/user.model";
import Invitation from "../models/invitation.model";
import { redirect } from "next/navigation";
import Permission from "../models/permission.model";
import { createTeamUser } from "./auth.actions";
import { saveActivityLogsNotification } from "./notification.actions";
import { changeUserPermissions } from "./permission.actions";

export const sendInvitation = async (
  name: string,
  role: string,
  email: string,
  agencyId: string,
  subAccountId?: string
) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (user?.role === role) {
      throw new Error("This user already has this role");
    }

    const response = await Invitation.create({
      name,
      email,
      agency: agencyId,
      role,
      subAccount: subAccountId ? subAccountId : null,
    });

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

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const verifyInvitation = async () => {
  try {
    await connectToDatabase();

    const user = await currentUser();

    if (!user) return redirect("/sign-in");

    const invitationExists = await Invitation.findOne({
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    });

    // check if user exist already to avoid duplicates users
    const isUserExist = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    }).populate({
      path: "permissions",
      model: Permission,
    });

    if (isUserExist) {
      return {
        agencyId: isUserExist.agency,
        subAccountId:
          isUserExist.role === "SUBACCOUNT_USER"
            ? isUserExist.permissions[0].subAccount
            : null,
      };
    }

    if (invitationExists) {
      const userDetails = await createTeamUser({
        clerkId: user.id,
        role: invitationExists.role,
        email: invitationExists.email,
        agency: invitationExists.agency,
        avatarUrl: user.imageUrl,
        name: `${user.firstName} ${user.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (userDetails) {
        await saveActivityLogsNotification({
          agencyId: invitationExists.agency,
          description: `Joined`,
          subAccountId: invitationExists.subAccount
            ? invitationExists.subAccount
            : undefined,
        });

        await clerkClient.users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });

        if (invitationExists.subAccount) {
          await changeUserPermissions(
            userDetails.email,
            invitationExists.subAccount,
            true
          );
        }

        await Invitation.deleteOne({
          email: userDetails.email,
        });

        return {
          agencyId: userDetails.agency,
          subAccountId: invitationExists.subAccount
            ? invitationExists.subAccount
            : null,
        };
      }

      return null;
    }

    return null;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
