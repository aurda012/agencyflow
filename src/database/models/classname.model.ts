import { Document, Schema, model, models, Types } from "mongoose";
import { IFunnel } from "./funnel.model";

export interface IClassName extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  customData: string;
  funnel: Types.ObjectId | IFunnel | string;
}

const ClassNameSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  color: String,
  customData: String,
  funnel: { type: Types.ObjectId, ref: "Funnel", onDelete: "cascade" },
});

const ClassName = models.ClassName || model("ClassName", ClassNameSchema);

export default ClassName;
