import { Document, Schema, model, models, Types } from "mongoose";
import { IAgency } from "./agency.model";

export interface IAddOn extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  active: boolean;
  priceId: string;
  agency: Types.ObjectId | IAgency | string;
}

const AddOnSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  active: { type: Boolean, default: false },
  priceId: { type: String, unique: true },
  agency: { type: Types.ObjectId, ref: "Agency", onDelete: "cascade" },
});

const AddOn = models.AddOn || model("AddOn", AddOnSchema);

export default AddOn;
