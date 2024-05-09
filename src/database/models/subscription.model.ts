import { Document, Schema, model, models, Types } from "mongoose";
import { IAgency } from "./agency.model";

export interface ISubscription extends Document {
  createdAt: Date;
  updatedAt: Date;
  plan: string;
  price: string;
  active: boolean;
  priceId: string;
  customerId: string;
  currentPeriodEndDate: Date;
  subscriptionId: string;
  agency: Types.ObjectId | IAgency | string;
}

const SubscriptionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  plan: String,
  price: String,
  active: { type: Boolean, default: false },
  priceId: String,
  customerId: String,
  currentPeriodEndDate: Date,
  subscriptionId: { type: String, unique: true },
  agency: { type: Types.ObjectId, ref: "Agency", onDelete: "cascade" },
});

const Subscription =
  models.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;
