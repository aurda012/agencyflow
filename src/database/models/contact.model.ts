import { Document, Schema, model, models, Types } from "mongoose";
import { ITicket } from "./ticket.model";
import { ISubAccount } from "./subaccount.model";

export interface IContact extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  subAccount: Types.ObjectId | ISubAccount | string;
  tickets: Types.ObjectId[] | ITicket[] | string[];
}

const ContactSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  email: String,
  subAccount: { type: Types.ObjectId, ref: "SubAccount", onDelete: "cascade" },
  tickets: [{ type: Types.ObjectId, ref: "Ticket" }],
});

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;
