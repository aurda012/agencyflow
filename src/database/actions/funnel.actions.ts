"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "..";
import Funnel, { IFunnel } from "../models/funnel.model";
import FunnelPage, { IFunnelPage } from "../models/funnelpage.model";
import SubAccount from "../models/subaccount.model";

export const getDomainContent = async (subDomainName: string) => {
  try {
    await connectToDatabase();

    const response = await Funnel.findOne({
      subDomainName,
    }).populate({
      path: "funnelPages",
      model: FunnelPage,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getFunnels = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const response = await Funnel.find({
      subAccount: subAccountId,
    }).populate({
      path: "funnelPages",
      model: FunnelPage,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getFunnel = async (funnelId: string) => {
  try {
    await connectToDatabase();

    const response = await Funnel.findOne({
      _id: funnelId,
    }).populate({
      path: "funnelPages",
      model: FunnelPage,
      options: {
        sort: { order: "asc" },
      },
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertFunnel = async (funnel: Partial<IFunnel>) => {
  try {
    await connectToDatabase();

    const response = await Funnel.findOneAndUpdate(
      { _id: funnel._id },
      {
        $set: {
          ...funnel,
        },
      },
      { new: true, upsert: true }
    );

    await SubAccount.findByIdAndUpdate(funnel.subAccount, {
      $push: { funnels: response._id },
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  try {
    await connectToDatabase();

    const response = await Funnel.findOneAndUpdate(
      { _id: funnelId },
      {
        $set: {
          liveProducts: products,
        },
      },
      { new: true }
    );

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertFunnelPage = async (
  subAccountId: string,
  funnelId: string,
  funnelPage: Partial<IFunnelPage>
) => {
  if (!subAccountId || !funnelId) return undefined;
  try {
    await connectToDatabase();

    const response = await FunnelPage.findOneAndUpdate(
      { _id: funnelPage._id },
      {
        $set: {
          ...funnelPage,
          funnel: funnelId,
          content: funnelPage.content
            ? funnelPage.content
            : JSON.stringify([
                {
                  content: [],
                  id: "__body",
                  name: "Body",
                  styles: { backgroundColor: "white" },
                  type: "__body",
                },
              ]),
        },
      },
      { new: true, upsert: true }
    );

    await Funnel.findByIdAndUpdate(funnelId, {
      $push: { funnelPages: response._id },
    });

    revalidatePath(`/subaccount/${subAccountId}/funnels/${funnelId}`);
    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteFunnelPage = async (funnelPageId: string) => {
  try {
    await connectToDatabase();

    const response = await FunnelPage.findByIdAndDelete(funnelPageId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  try {
    await connectToDatabase();

    const response = await FunnelPage.findById(funnelPageId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateFunnelPageVisits = async (funnelPageId: string) => {
  try {
    await connectToDatabase();
    // * Update view count for each question viewing...
    const response = await FunnelPage.findByIdAndUpdate(funnelPageId, {
      $inc: { visits: 1 },
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
