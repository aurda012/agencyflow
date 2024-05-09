import { Document, Schema, model, models, Types } from "mongoose";
import { ISubAccount } from "./subaccount.model";

export interface IMedia extends Document {
  createdAt: Date;
  updatedAt: Date;
  type: string;
  name: string;
  link: string;
  subAccount: Types.ObjectId | ISubAccount | string;
}

const MediaSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: String,
  name: String,
  link: { type: String, unique: true },
  subAccount: { type: Types.ObjectId, ref: "SubAccount", onDelete: "cascade" },
});

const Media = models.Media || model("Media", MediaSchema);

export default Media;
