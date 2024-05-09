"use server";

import { connectToDatabase } from "..";
import Tag, { ITag } from "../models/tag.model";

export const upsertTag = async (subAccountId: string, tag: Partial<ITag>) => {
  try {
    await connectToDatabase();
    const response = await Tag.findOneAndUpdate(
      {
        _id: tag._id,
        subAccount: subAccountId,
      },
      {
        $set: {
          ...tag,
          subAccount: subAccountId,
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

export const getTagsForSubAccount = async (subAccountId: string) => {
  try {
    await connectToDatabase();
    const response = await Tag.find({
      subAccount: subAccountId,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteTag = async (tagId: string) => {
  try {
    await connectToDatabase();
    const response = await Tag.findByIdAndDelete(tagId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
