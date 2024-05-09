import { Document, Schema, model, models, Types } from "mongoose";
import { ISubAccount } from "./subaccount.model";
import { ITicket } from "./ticket.model";

export interface ITag {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  subAccount: Types.ObjectId | ISubAccount | string; // reference to the SubAccount model
  tickets: Types.ObjectId[] | ITicket[] | string[] | []; // Array of references to the Ticket model
}

const TagSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  color: String,
  subAccount: {
    type: Types.ObjectId,
    ref: "SubAccount", // reference to the SubAccount model
    required: true,
  },
  tickets: [{ type: Types.ObjectId, ref: "Ticket" }], // Array of references to the Ticket model
});

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
