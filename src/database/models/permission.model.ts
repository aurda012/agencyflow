import { Document, Schema, model, models, Types } from "mongoose";
import { IUser } from "./user.model";
import { ISubAccount } from "./subaccount.model";

export interface IPermission extends Document {
  email: string;
  access: boolean;
  user: Types.ObjectId | IUser | string;
  subAccount: Types.ObjectId | ISubAccount | string;
  subAccountId: string;
}

const PermissionSchema = new Schema({
  email: { type: String, required: true },
  access: { type: Boolean, default: false },
  user: {
    type: Types.ObjectId,
    ref: "User",
    onDelete: "cascade",
    required: true,
  },
  subAccountId: { type: String, required: true },
  subAccount: { type: Types.ObjectId, ref: "SubAccount", required: true },
});

const Permission = models.Permission || model("Permission", PermissionSchema);

export default Permission;
