import { Document, Schema, model, models, Types } from "mongoose";
import { IUser } from "./user.model";
import { IAgency } from "./agency.model";
import { ISubAccount } from "./subaccount.model";

export interface INotification extends Document {
  createdAt: Date;
  updatedAt: Date;
  notification: string;
  user: Types.ObjectId | IUser | string;
  agency: Types.ObjectId | IAgency | string;
  subAccount: Types.ObjectId | ISubAccount | string;
}

const NotificationSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notification: String,
  user: { type: Types.ObjectId, ref: "User", onDelete: "cascade" },
  agency: { type: Types.ObjectId, ref: "Agency", onDelete: "cascade" },
  subAccount: { type: Types.ObjectId, ref: "SubAccount", onDelete: "cascade" },
});

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;
