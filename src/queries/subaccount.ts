"use server";

import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
import { Role, type SubAccount } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { sendInvitation } from "./invitations";

export const getSubAccountDetails = async (subAccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subAccountId,
    },
  });

  return response;
};

export const getSubAccountsByAgency = async (agencyId: string) => {
  const response = await db.subAccount.findMany({
    where: {
      agencyId,
    },
  });

  return response;
};

export const upsertSubAccount = async (
  subAccount: SubAccount,
  path: string,
  newSubAccount: boolean
) => {
  if (newSubAccount) {
    if (!subAccount.companyEmail) return null;

    const agencyOwner = await db.user.findFirst({
      where: {
        agency: {
          id: subAccount.agencyId,
        },
        role: Role.AGENCY_OWNER,
      },
    });

    if (!agencyOwner) {
      throw new Error("Could not create subaccount");
    }

    const permissionId = uuidv4();

    const response = await db.subAccount.upsert({
      where: {
        id: subAccount.id,
      },
      update: subAccount,
      create: {
        ...subAccount,
        permissions: {
          create: {
            id: permissionId,
            access: true,
            email: agencyOwner.email,
          },
          connect: {
            subAccountId: subAccount.id,
            id: permissionId,
          },
        },
        pipelines: {
          create: {
            name: "Lead Cycle",
          },
        },
      },
    });

    revalidatePath(path);
    return response;
  } else {
    const response = await db.subAccount.update({
      where: {
        id: subAccount.id,
      },
      data: subAccount,
    });
    revalidatePath(path);
    return response;
  }
};

export const getSubAccountTeamMembers = async (subAccountId: string) => {
  const subAccountWithAccess = await db.user.findMany({
    where: {
      agency: {
        subAccounts: {
          some: {
            id: subAccountId,
          },
        },
      },
      role: Role.SUBACCOUNT_USER,
      permissions: {
        some: {
          subAccountId,
          access: true,
        },
      },
    },
  });

  return subAccountWithAccess;
};

export const deleteSubAccount = async (subAccountId: string) => {
  const response = await db.subAccount.delete({
    where: {
      id: subAccountId,
    },
  });
  const deletePermissions = await db.permissions.deleteMany({
    where: {
      subAccountId,
    },
  });

  return response;
};

export const updateSubAccountConnectedId = async (
  subAccountId: string,
  connectAccountId: string
) => {
  const response = await db.subAccount.update({
    where: {
      id: subAccountId,
    },
    data: {
      connectAccountId,
    },
  });

  return response;
};
