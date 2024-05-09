"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "..";
import SubAccount, { ISubAccount } from "../models/subaccount.model";
import User from "../models/user.model";
import Permission from "../models/permission.model";
import Pipeline from "../models/pipeline.model";
import { sub } from "date-fns";
import Agency from "../models/agency.model";
import { Types } from "mongoose";

export const getSubAccountDetails = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const response = await SubAccount.findById(subAccountId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getSubAccountsByAgency = async (agencyId: string) => {
  try {
    await connectToDatabase();
    const response = await SubAccount.find({ agency: agencyId });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertSubAccount = async (
  subAccount: Partial<ISubAccount>,
  path: string,
  newSubAccount: boolean
) => {
  try {
    await connectToDatabase();

    if (newSubAccount) {
      if (!subAccount.companyEmail) return null;

      const subAccountId = new Types.ObjectId(subAccount._id);

      const agencyOwner = await User.findOne({
        agency: subAccount.agency,
        role: "AGENCY_OWNER",
      });

      if (!agencyOwner) {
        throw new Error("Could not create subaccount");
      }
      const perm = await Permission.create({
        access: true,
        email: agencyOwner.email,
        user: agencyOwner._id,
        subAccount: subAccountId,
        subAccountId: subAccountId.toString(),
      });

      await User.findByIdAndUpdate(agencyOwner._id, {
        $push: {
          permissions: perm._id,
        },
      });

      const pipeline = await Pipeline.create({
        subAccount: subAccountId,
        name: "Lead Cycle",
      });

      const response = await SubAccount.findOneAndUpdate(
        { _id: subAccountId },
        {
          $set: {
            ...subAccount,
          },
          $push: {
            permissions: perm._id,
            pipelines: pipeline._id,
          },
        },
        { new: true, upsert: true }
      );

      await Agency.findByIdAndUpdate(subAccount.agency, {
        $push: {
          subAccounts: subAccountId,
        },
      });

      revalidatePath(path);
      return JSON.parse(JSON.stringify(response));
    } else {
      const response = await SubAccount.findByIdAndUpdate(
        subAccount._id,
        { ...subAccount },
        { new: true }
      );
      revalidatePath(path);
      return JSON.parse(JSON.stringify(response));
    }
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getSubAccountTeamMembers = async (subAccountId: string) => {
  try {
    await connectToDatabase();
    const agency = await Agency.findOne({ subAccounts: subAccountId });
    const teamMembers = await User.find({
      agency: agency._id,
    }).populate({
      path: "permissions",
      model: Permission,
      match: { subAccount: subAccountId, access: true },
    });

    const teamMembersWithAccess = teamMembers.filter((user) => {
      return user.permissions.length > 0;
    });

    return JSON.parse(JSON.stringify(teamMembersWithAccess));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteSubAccount = async (subAccountId: string) => {
  try {
    await connectToDatabase();
    const response = await SubAccount.findByIdAndDelete(subAccountId);
    await Permission.deleteMany({
      subAccount: subAccountId,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateSubAccountConnectedId = async (
  subAccountId: string,
  connectAccountId: string
) => {
  try {
    await connectToDatabase();
    const response = await SubAccount.findByIdAndUpdate(
      subAccountId,
      {
        connectAccountId,
      },
      { new: true }
    );

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
