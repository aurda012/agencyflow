"use server";

import Stripe from "stripe";
import { stripe as StripeInstance } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Plan, Prisma } from "@prisma/client";
import { logger } from "@/lib/utils";
import { ADD_ONS } from "@/config/add-ons";
import { connectToDatabase } from "@/database";
import Agency from "@/database/models/agency.model";
import SubAccount from "@/database/models/subaccount.model";
import Subscription, {
  ISubscription,
} from "@/database/models/subscription.model";

export const subscriptionCreate = async (
  subscription: Stripe.Subscription,
  customerId: string
) => {
  try {
    await connectToDatabase();

    const agency = await Agency.findOne({
      customerId,
    }).populate({ path: "subAccounts", model: SubAccount });

    if (!agency) {
      throw new Error("Could not find an agency to upsert the subscription");
    }

    const data: Partial<ISubscription> = {
      active: subscription.status === "active",
      agency: agency._id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      // @ts-ignore
      priceId: subscription.plan.id,
      subscriptionId: subscription.id,
      // @ts-ignore
      plan: subscription.plan.id as Plan,
    };

    const response = await Subscription.findOneAndUpdate(
      { agency: agency._id },
      { $set: { ...data } },
      { new: true, upsert: true }
    );

    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    logger(error);
  }
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
  const products = await StripeInstance.products.list(
    {
      limit: 50,
      expand: ["data.default_price"],
    },
    {
      stripeAccount,
    }
  );

  return products.data;
};

export const getAddOnsProducts = async () => {
  const addOnsProducts = await StripeInstance.products.list({
    ids: ADD_ONS.map((addOn) => addOn.id),
    expand: ["data.default_price"],
  });

  return addOnsProducts;
};

export const getPrices = async () => {
  const prices = await StripeInstance.prices.list({
    product: process.env.NEXT_PUBLIC_PLURA_PRODUCT_ID,
    active: true,
  });

  return prices;
};

export const getCharges = async (customerId: string | undefined) => {
  const charges = await StripeInstance.charges.list({
    limit: 50,
    customer: customerId,
  });

  return charges;
};
