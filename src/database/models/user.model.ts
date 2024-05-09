import { Document, Schema, model, models, Types } from "mongoose";
import { IPermission } from "./permission.model";
import { ITicket } from "./ticket.model";
import { INotification } from "./notification.model";

export interface IUser extends Document {
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  avatarUrl: string;
  email: string;
  role: string;
  agency: Types.ObjectId;
  permissions: Types.ObjectId[] | IPermission[] | string[];
  tickets: Types.ObjectId[] | ITicket[] | string[];
  notification: Types.ObjectId[] | INotification[] | string[];
}

const UserSchema = new Schema({
  clerkId: String,
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, default: "SUBACCOUNT_USER" },
  agency: {
    type: Types.ObjectId,
    ref: "Agency",
    onDelete: "cascade",
  },
  permissions: [{ type: Types.ObjectId, ref: "Permission" }],
  tickets: [{ type: Types.ObjectId, ref: "Ticket" }],
  notification: [{ type: Types.ObjectId, ref: "Notification" }],
});

const User = models.User || model("User", UserSchema);

export default User;
