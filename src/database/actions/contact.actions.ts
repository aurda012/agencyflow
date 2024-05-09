"use server";

import { connectToDatabase } from "..";
import Contact, { IContact } from "../models/contact.model";
import SubAccount from "../models/subaccount.model";
import Ticket from "../models/ticket.model";

export const searchContacts = async (
  searchTerms: string,
  subAccount: string
) => {
  try {
    await connectToDatabase();

    const response = await Contact.find([
      { subAccount: subAccount },
      {
        name: {
          $regex: searchTerms,
          $options: "i", // Case-insensitive search
        },
      },
    ]);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getSubAccountWithContacts = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const response = await SubAccount.findOne({ _id: subAccountId }).populate({
      path: "contacts",
      model: Contact,
      options: {
        sort: { createdAt: "asc" },
      },
      populate: [{ path: "tickets", model: Ticket, select: "value" }],
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertContact = async (contact: Partial<IContact>) => {
  try {
    const response = await Contact.findOneAndUpdate(
      { _id: contact._id },
      {
        $set: {
          ...contact,
        },
      },
      { new: true, upsert: true }
    );

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
