import { Document, Schema, model, models, Types } from "mongoose";

export interface ITrigger extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  type: string;
  subaccount: Types.ObjectId;
  automations: Types.ObjectId[];
}

const TriggerSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  type: String,
  subaccount: { type: Types.ObjectId, ref: "SubAccount", onDelete: "cascade" },
  automations: [{ type: Types.ObjectId, ref: "Automation" }],
});

const Trigger = models.Trigger || model("Trigger", TriggerSchema);

export default Trigger;
