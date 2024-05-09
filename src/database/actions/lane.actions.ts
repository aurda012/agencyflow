"use server";

import { connectToDatabase } from "..";
import Contact from "../models/contact.model";
import Lane, { ILane, ILaneWithTicketsAndTags } from "../models/lane.model";
import Pipeline from "../models/pipeline.model";
import Tag from "../models/tag.model";
import Ticket, { ITicket, ITicketPopulated } from "../models/ticket.model";
import User from "../models/user.model";

export const getLanesWithTicketsAndTags = async (pipelineId: string) => {
  try {
    await connectToDatabase();

    const lane = await Lane.find({
      pipeline: pipelineId,
    })
      .sort({ order: "asc" })
      .populate({
        path: "tickets",
        model: Ticket,
        options: {
          sort: { order: 1 },
        },
        populate: [
          { path: "tags", model: Tag },
          { path: "customer", model: Contact },
          { path: "assigned", model: User },
        ],
      });

    return JSON.parse(JSON.stringify(lane));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateLanesOrder = async (lanes: ILaneWithTicketsAndTags[]) => {
  try {
    await connectToDatabase();

    await Promise.all(
      lanes.map(
        async (lane) =>
          await Lane.findByIdAndUpdate(lane._id, { order: lane.order })
      )
    );
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updateTicketsOrder = async (
  tickets: ITicketPopulated[],
  originLane?: string,
  destinationLane?: string,
  ticket?: string
) => {
  try {
    await connectToDatabase();

    console.log("Inside Update Tickets Order", tickets);

    await Promise.all(
      tickets.map(
        async (ticket) =>
          await Ticket.findByIdAndUpdate(ticket._id, {
            order: ticket.order,
            lane: ticket.lane,
          })
      )
    );
    if (originLane && destinationLane && ticket) {
      await Lane.findByIdAndUpdate(originLane, {
        $pull: { tickets: ticket },
      });
      await Lane.findByIdAndUpdate(destinationLane, {
        $push: { tickets: ticket },
      });
    }
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteLane = async (laneId: string) => {
  try {
    await connectToDatabase();
    const response = await Lane.findByIdAndDelete(laneId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertLane = async (lane: Partial<ILane>) => {
  let order: number;

  try {
    await connectToDatabase();
    if (!lane.order) {
      const lanes = await Lane.find({
        pipeline: lane.pipeline,
      });

      order = lanes.length; // set last order by default
    } else {
      order = lane.order;
    }

    const response = await Lane.findOneAndUpdate(
      { _id: lane._id },
      {
        $set: {
          ...lane,
          order,
        },
      },
      { new: true, upsert: true }
    );

    await Pipeline.findByIdAndUpdate(lane.pipeline, {
      $push: { lanes: response._id },
    });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
