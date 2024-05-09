"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "..";
import User, { IUser } from "../models/user.model";
import Agency from "../models/agency.model";
import SubAccount from "../models/subaccount.model";
import Permission from "../models/permission.model";
import { Types } from "mongoose";

export const getAuthUser = async (email: string) => {
  try {
    await connectToDatabase();

    const details = await User.findOne({
      email,
    });

    if (!details) {
      throw new Error("Not authorized");
    }

    return JSON.parse(JSON.stringify(details));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getAuthUserDetails = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return;
    }

    await connectToDatabase();

    const userData = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    })
      .populate({
        path: "agency",
        model: Agency,
        populate: [{ path: "subAccounts", model: SubAccount }],
      })
      .populate({
        path: "permissions",
        model: Permission,
        populate: [{ path: "subAccount", model: SubAccount }],
      });

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getAuthUserGroup = async (agencyId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return;
    }

    await connectToDatabase();

    const teamMembers = await User.find({
      agency: agencyId,
    })
      .populate({
        path: "agency",
        model: Agency,
        populate: [{ path: "subAccounts", model: SubAccount }],
      })
      .populate({
        path: "permissions",
        model: Permission,
        populate: [{ path: "subAccount", model: SubAccount }],
      });

    return JSON.parse(JSON.stringify(teamMembers));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    await clerkClient.users.updateUserMetadata(clerkId, {
      privateMetadata: {
        role: undefined,
      },
    });
    await clerkClient.users.deleteUser(clerkId);

    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });

    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const createTeamUser = async (user: Partial<IUser>) => {
  if (user.role === "AGENCY_OWNER") return null; // allready have an access

  try {
    await connectToDatabase();

    const userData = await User.create({ ...user });

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const initUser = async (newUser: Partial<IUser>) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new Error("User not found");
    }

    await connectToDatabase();

    const userData = await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress },
      {
        $set: {
          ...newUser,
          clerkId: user.id,
          avatarUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
          role: newUser.role || "SUBACCOUNT_USER",
          agency: new Types.ObjectId(newUser.agency),
        },
      },
      { new: true, upsert: true }
    );

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: newUser.role || "SUBACCOUNT_USER",
      },
    });

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateUser = async (user: Partial<IUser>) => {
  try {
    await connectToDatabase();

    const userData = await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          ...user,
        },
      },
      { new: true }
    );

    await clerkClient.users.updateUserMetadata(userData.clerkId, {
      privateMetadata: {
        role: user.role || "SUBACCOUNT_USER",
      },
    });

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
