import { Document, Schema, model, models, Types } from "mongoose";
import { IFunnel } from "./funnel.model";

export interface IFunnelPage extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  pathName: string;
  visits: number;
  content: string;
  order: number;
  previewImage: string;
  funnel: Types.ObjectId | IFunnel | string;
}

const FunnelPageSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  pathName: String,
  visits: { type: Number, default: 0 },
  content: String,
  order: Number,
  previewImage: String,
  funnel: { type: Types.ObjectId, ref: "Funnel", onDelete: "cascade" },
});

const FunnelPage = models.FunnelPage || model("FunnelPage", FunnelPageSchema);

export default FunnelPage;
