import { Document, Schema, model, models, Types } from "mongoose";
import { ISubAccount } from "./subaccount.model";
import { IAgency } from "./agency.model";

export interface IInvitation extends Document {
  email: string;
  name: string;
  subAccount: Types.ObjectId | ISubAccount | string;
  agency: Types.ObjectId | IAgency | string;
  status: string;
  role: string;
}

const InvitationSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  subAccount: { type: Types.ObjectId, ref: "SubAccount" },
  agency: { type: Types.ObjectId, ref: "Agency", onDelete: "cascade" },
  status: { type: String, default: "PENDING" },
  role: { type: String, default: "SUBACCOUNT_USER" },
});

const Invitation = models.Invitation || model("Invitation", InvitationSchema);

export default Invitation;
