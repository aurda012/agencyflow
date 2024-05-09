"use server";

import { connectToDatabase } from "..";
import Agency, { IAgency } from "../models/agency.model";
import SubAccount from "../models/subaccount.model";
import User from "../models/user.model";

export const getAgencyDetails = async (agencyId: string) => {
  try {
    await connectToDatabase();

    const agencyDetails = await Agency.findById(agencyId).populate({
      path: "subAccounts",
      model: SubAccount,
    });

    if (!agencyDetails) {
      throw new Error("Agency not found");
    }

    return JSON.parse(JSON.stringify(agencyDetails));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<IAgency>
) => {
  try {
    await connectToDatabase();

    const response = await Agency.findByIdAndUpdate(agencyId, agencyDetails, {
      new: true,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteAgency = async (agencyId: string) => {
  try {
    await connectToDatabase();

    const deletedAgency = await Agency.findByIdAndDelete(agencyId);

    await SubAccount.deleteMany({ agency: agencyId });

    return JSON.parse(JSON.stringify(deletedAgency));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertAgency = async (agency: Partial<IAgency>) => {
  if (!agency.companyEmail) return null;
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: agency.companyEmail });

    const agencyDetails = await Agency.findOneAndUpdate(
      { _id: agency._id },
      {
        $set: {
          ...agency,
        },
        $push: { users: user._id },
      },
      { new: true, upsert: true }
    );

    return JSON.parse(JSON.stringify(agencyDetails));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getAgencySubscription = async (agencyId: string) => {
  try {
    await connectToDatabase();

    const agencySubscription = await Agency.findById(agencyId, {
      customerId: 1,
      subscription: 1,
    });

    return JSON.parse(JSON.stringify(agencySubscription));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateAgencyConnectedId = async (
  agencyId: string,
  connectAccountId: string
) => {
  try {
    await connectToDatabase();

    const agency = await Agency.findByIdAndUpdate(
      agencyId,
      {
        $set: {
          connectAccountId,
        },
      },
      { new: true }
    );

    return JSON.parse(JSON.stringify(agency));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
