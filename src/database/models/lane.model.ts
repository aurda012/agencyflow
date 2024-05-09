import { Document, Schema, model, models, Types } from "mongoose";
import { ITicket, ITicketPopulated } from "./ticket.model";
import { IPipeline } from "./pipeline.model";

export interface ILane extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  order: number;
  color: string;
  pipeline: Types.ObjectId | IPipeline | string;
  tickets: Types.ObjectId[] | ITicket[] | string[];
}

export interface ILaneWithTicketsAndTags {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  order: number;
  color: string;
  pipeline: string;
  tickets: ITicketPopulated[];
}

const LaneSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  order: { type: Number, default: 0 },
  color: String,
  pipeline: {
    type: Schema.Types.ObjectId,
    ref: "Pipeline",
    onDelete: "cascade",
  },
  tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
});

const Lane = models.Lane || model("Lane", LaneSchema);

export default Lane;
