"use server";

import { CreateMediaType } from "@/lib/types";
import { connectToDatabase } from "..";
import SubAccount from "../models/subaccount.model";
import Media from "../models/media.model";

export const getMedia = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const mediaFiles = await SubAccount.findById(subAccountId).populate({
      path: "media",
      model: Media,
    });

    return JSON.parse(JSON.stringify(mediaFiles));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const createMedia = async (
  subAccountId: string,
  mediaFiles: CreateMediaType
) => {
  const { link, name } = mediaFiles;

  try {
    await connectToDatabase();

    const response = await Media.create({
      subAccount: subAccountId,
      link,
      name,
    });

    await SubAccount.findByIdAndUpdate(subAccountId, {
      $push: { media: response._id },
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteMedia = async (mediaId: string) => {
  try {
    await connectToDatabase();
    const response = await Media.findByIdAndDelete(mediaId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
