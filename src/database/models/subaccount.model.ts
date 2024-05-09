import { Document, Schema, model, models, Types } from "mongoose";
import { IPermission } from "./permission.model";
import { IFunnel } from "./funnel.model";
import { IMedia } from "./media.model";
import { IContact } from "./contact.model";
import { IPipeline } from "./pipeline.model";
import { ITag } from "./tag.model";
import { INotification } from "./notification.model";

export interface ISubAccount extends Document {
  createdAt: Date;
  updatedAt: Date;
  connectAccountId: string;
  name: string;
  subAccountLogo: string; // Assuming you want the type to be a string instead of Text
  companyEmail: string;
  companyPhone: string;
  goal: number;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  agency: Types.ObjectId; // Reference to the Agency model
  permissions: Types.ObjectId[] | IPermission[] | string[];
  funnels: Types.ObjectId[] | IFunnel[] | string[];
  media: Types.ObjectId[] | IMedia[] | string[];
  contacts: Types.ObjectId[] | IContact[] | string[];
  pipelines: Types.ObjectId[] | IPipeline[] | string[];
  tags: Types.ObjectId[] | ITag[] | string[];
  notifications: Types.ObjectId[] | INotification[] | string[];
}

const SubAccountSchema = new Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  connectAccountId: String,
  name: String,
  subAccountLogo: { type: String, required: true }, // Assuming you want the type to be a string instead of Text
  companyEmail: String,
  companyPhone: String,
  goal: { type: Number, required: true, default: 5 },
  address: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  agency: {
    type: Types.ObjectId,
    ref: "Agency",
    onDelete: "Cascade",
  }, // Reference to the Agency model
  permissions: [{ type: Types.ObjectId, ref: "Permission" }],
  funnels: [{ type: Types.ObjectId, ref: "Funnel" }],
  media: [{ type: Types.ObjectId, ref: "Media" }],
  contacts: [{ type: Types.ObjectId, ref: "Contact" }],
  pipelines: [{ type: Types.ObjectId, ref: "Pipeline" }],
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  notifications: [{ type: Types.ObjectId, ref: "Notification" }],
});

const SubAccount = models.SubAccount || model("SubAccount", SubAccountSchema);

export default SubAccount;
