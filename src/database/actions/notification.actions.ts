"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "..";
import User from "../models/user.model";
import Agency from "../models/agency.model";
import SubAccount from "../models/subaccount.model";
import Notification from "../models/notification.model";

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  subAccountId?: string;
  description: string;
}) => {
  try {
    await connectToDatabase();
    const authUser = await currentUser();
    let userData;

    if (!authUser) {
      const agency = await Agency.findOne({ subAccounts: subAccountId });

      if (!agency) {
        throw new Error("Could not find an agency with that subaccount");
      }

      const response = await User.findOne({ agency: agency._id });

      if (response) {
        userData = response;
      }
    } else {
      const response = await User.findOne({
        email: authUser.emailAddresses[0].emailAddress,
      });

      if (response) {
        userData = response;
      }
    }

    if (!userData) {
      throw new Error("Could not find a user");
    }

    let foundAgencyId = agencyId;

    if (!foundAgencyId) {
      if (!subAccountId) {
        throw new Error(
          "You need to provide at least an agency id or subaccount id"
        );
      }

      const response = await SubAccount.findById(subAccountId);

      if (response) {
        foundAgencyId = response.agency;
      }
    }

    if (subAccountId) {
      await Notification.create({
        notification: `${userData.name} | ${description}`,
        user: userData._id,
        agency: foundAgencyId,
        subAccount: subAccountId,
      });
    } else {
      await Notification.create({
        notification: `${userData.name} | ${description}`,
        user: userData._id,
        agency: foundAgencyId,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getNotifications = async (agencyId: string) => {
  try {
    await connectToDatabase();

    const response = await Notification.find({
      agency: agencyId,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "user",
        model: User,
      });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
