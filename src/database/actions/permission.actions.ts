"use server";

import { Types } from "mongoose";
import { connectToDatabase } from "..";
import Permission from "../models/permission.model";
import SubAccount from "../models/subaccount.model";
import User from "../models/user.model";

export const getUserWithPermissionsAndSubAccount = async (userId: string) => {
  try {
    await connectToDatabase();

    const response = await User.findById(userId)
      .select({ permissions: 1 })
      .populate({
        path: "permissions",
        model: Permission,
        populate: [{ path: "subAccount", model: SubAccount }],
      });

    if (!response) throw new Error("No user found");

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const changeUserPermissions = async (
  userEmail: string,
  subAccountId: string,
  access: boolean,
  permissionId?: string
) => {
  try {
    await connectToDatabase();

    const newId = new Types.ObjectId();

    const response = await Permission.findOneAndUpdate(
      { _id: permissionId ? permissionId : newId },
      {
        $set: {
          access,
          subAccount: subAccountId,
          subAccountId: subAccountId,
          email: userEmail,
        },
      },
      { new: true, upsert: true }
    );

    if (!response)
      throw new Error("Could not update or create new permission for user");

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $push: {
          permissions: response._id,
        },
      }
    );

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
