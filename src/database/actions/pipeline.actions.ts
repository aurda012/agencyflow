"use server";

import { connectToDatabase } from "..";
import Lane from "../models/lane.model";
import Pipeline, { IPipeline } from "../models/pipeline.model";
import Ticket from "../models/ticket.model";

export const getUserPipelines = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const pipelines = await Pipeline.find({
      subAccount: subAccountId,
    });

    return JSON.parse(JSON.stringify(pipelines));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getPipelines = async (subAccountId: string) => {
  try {
    await connectToDatabase();
    const pipelines = await Pipeline.find({
      subAccount: subAccountId,
    }).populate({
      path: "lanes",
      model: Lane,
      populate: [{ path: "tickets", model: Ticket }],
    });

    return JSON.parse(JSON.stringify(pipelines));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getPipelineDetails = async (pipelineId: string) => {
  try {
    await connectToDatabase();
    const response = await Pipeline.findById(pipelineId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const createPipeline = async (subAccountId: string) => {
  try {
    await connectToDatabase();

    const response = await Pipeline.create({
      name: "First Pipeline",
      subAccount: subAccountId,
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertPipeline = async (pipeline: IPipeline) => {
  try {
    await connectToDatabase();
    const response = await Pipeline.findOneAndUpdate(
      { _id: pipeline._id },
      {
        $set: {
          ...pipeline,
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

export const deletePipeline = async (pipelineId: string) => {
  try {
    await connectToDatabase();
    const response = await Pipeline.findByIdAndDelete(pipelineId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
