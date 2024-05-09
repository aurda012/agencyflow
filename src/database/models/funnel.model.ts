import { Document, Schema, model, models, Types } from "mongoose";
import { IFunnelPage } from "./funnelpage.model";
import { IClassName } from "./classname.model";
import { ISubAccount } from "./subaccount.model";

export interface IFunnel extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  published: boolean;
  subDomainName: string;
  favicon: string;
  liveProducts: string;
  subAccount: Types.ObjectId | ISubAccount | string;
  funnelPages: Types.ObjectId[] | IFunnelPage[] | string[];
  className: Types.ObjectId[] | IClassName[] | string[];
}

const FunnelSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  description: String,
  published: { type: Boolean, default: false },
  subDomainName: { type: String, unique: true },
  favicon: String,
  liveProducts: { type: String, default: "[]" },
  subAccount: { type: Types.ObjectId, ref: "SubAccount", onDelete: "cascade" },
  funnelPages: [{ type: Types.ObjectId, ref: "FunnelPage" }],
  className: [{ type: Types.ObjectId, ref: "ClassName" }],
});

const Funnel = models.Funnel || model("Funnel", FunnelSchema);

export default Funnel;
