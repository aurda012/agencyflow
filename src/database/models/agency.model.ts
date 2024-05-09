import { Document, Schema, model, models, Types } from "mongoose";
import { IUser } from "./user.model";
import { ISubAccount } from "./subaccount.model";
import { IInvitation } from "./invitation.model";
import { INotification } from "./notification.model";
import { ISubscription } from "./subscription.model";
import { IAddOn } from "./addon.model";

export interface IAgency extends Document {
  createdAt: Date;
  updatedAt: Date;
  connectAccountId: string;
  customerId: string;
  name: string;
  agencyLogo: string;
  companyEmail: string;
  companyPhone: string;
  whiteLabel: boolean;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  users: Types.ObjectId[] | IUser[] | string[];
  subAccounts: Types.ObjectId[] | ISubAccount[] | string[];
  invitations: Types.ObjectId[] | IInvitation[] | string[];
  notifications: Types.ObjectId[] | INotification[] | string[];
  subscription: Types.ObjectId[] | ISubscription[] | string[];
  addOns: Types.ObjectId[] | IAddOn[] | string[];
}

const AgencySchema = new Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  connectAccountId: String,
  customerId: String,
  name: String,
  agencyLogo: { type: String, required: true }, // Assuming you want the type to be a string instead of Text
  companyEmail: String,
  companyPhone: String,
  whiteLabel: { type: Boolean, required: true, default: true },
  address: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  goal: { type: Number, required: true, default: 5 },
  users: [{ type: Types.ObjectId, ref: "User" }],
  subAccounts: [{ type: Types.ObjectId, ref: "SubAccount" }],
  invitations: [{ type: Types.ObjectId, ref: "Invitation" }],
  notifications: [{ type: Types.ObjectId, ref: "Notification" }],
  subscription: [{ type: Types.ObjectId, ref: "Subscription" }],
  addOns: [{ type: Types.ObjectId, ref: "AddOn" }],
});

const Agency = models.Agency || model("Agency", AgencySchema);

export default Agency;
