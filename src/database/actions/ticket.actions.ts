"use server";

import { connectToDatabase } from "..";
import Ticket, { ITicket } from "../models/ticket.model";
import Lane from "../models/lane.model";
import Tag, { ITag } from "../models/tag.model";
import User from "../models/user.model";
import Contact from "../models/contact.model";

export const getTicketsWithTags = async (pipelineId: string) => {
  try {
    await connectToDatabase();
    const lanes = await Lane.find({ pipeline: pipelineId }, "_id");
    const tickets = await Promise.all(
      lanes.map(async (lane) => {
        return await Ticket.find({
          lane: lane._id,
        })
          .populate({ path: "tags", model: Tag })
          .populate({ path: "assigned", model: User })
          .populate({ path: "customer", model: Contact });
      })
    );
    return JSON.parse(JSON.stringify(tickets));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getTicketDetails = async (laneId: string) => {
  try {
    await connectToDatabase();
    const response = await Ticket.find({
      lane: laneId,
    })
      .populate({ path: "lane", model: Lane })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "assigned", model: User })
      .populate({ path: "customer", model: Contact });

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const upsertTicket = async (ticket: Partial<ITicket>, tags: ITag[]) => {
  let order: number;
  try {
    await connectToDatabase();

    if (!ticket.order) {
      const tickets = await Ticket.find({
        lane: ticket.lane,
      });

      order = tickets.length;
    } else {
      order = ticket.order;
    }

    const tagIds = tags.map((tag) => tag._id);

    const response = await Ticket.findByIdAndUpdate(
      ticket._id,
      {
        $set: {
          ...ticket,
          order,
        },
        $push: {
          tags: {
            $each: tagIds,
          },
        },
      },
      { new: true, upsert: true }
    )
      .populate({ path: "lane", model: Lane })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "assigned", model: User })
      .populate({ path: "customer", model: Contact });

    await Promise.all(
      tagIds.map(async (tagId) => {
        await Tag.findByIdAndUpdate(tagId, {
          $push: {
            tickets: response._id,
          },
        });
      })
    );

    await Lane.findByIdAndUpdate(response.lane._id, {
      $push: {
        tickets: response._id,
      },
    });

    if (ticket.customer) {
      await Contact.findByIdAndUpdate(ticket.customer, {
        $push: {
          tickets: response._id,
        },
      });
    }

    console.log("Ticket: ", response);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const deleteTicket = async (ticketId: string) => {
  try {
    await connectToDatabase();
    const response = await Ticket.findByIdAndDelete(ticketId);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
