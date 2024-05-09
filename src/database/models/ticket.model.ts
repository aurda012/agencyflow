import { Document, Schema, model, models, Types } from "mongoose";
import { ILane } from "./lane.model";
import { IContact } from "./contact.model";
import { ITag } from "./tag.model";
import { IUser } from "./user.model";

export interface ITicket extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  order: number;
  value: number;
  description: string;
  lane: Types.ObjectId | ILane | string;
  customer: Types.ObjectId | IContact | string;
  tags: Types.ObjectId[] | ITag[] | string[];
  assigned: Types.ObjectId | IUser | string;
}

export interface ITicketPopulated {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  order: number;
  value: number;
  description: string;
  lane: string;
  customer: IContact;
  tags: ITag[];
  assigned: IUser;
}

const TicketSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  order: { type: Number, default: 0 },
  value: { type: Number, default: null },
  description: String,
  lane: { type: Types.ObjectId, ref: "Lane", onDelete: "cascade" },
  customer: { type: Types.ObjectId, ref: "Contact", onDelete: "set null" },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  assigned: { type: Types.ObjectId, ref: "User", onDelete: "set null" },
});

const Ticket = models.Ticket || model("Ticket", TicketSchema);

export default Ticket;
