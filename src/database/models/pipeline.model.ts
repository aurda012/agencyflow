import { Document, Schema, model, models, Types } from "mongoose";
import { ILane, ILaneWithTicketsAndTags } from "./lane.model";
import { ISubAccount } from "./subaccount.model";

export interface IPipeline extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  subAccount: Types.ObjectId | ISubAccount | string; // reference to the SubAccount model
  lanes: Types.ObjectId[] | ILane[] | string[]; // Array of references to the Lane model
}

export interface IPipelinePopulated {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  subAccount: string; // reference to the SubAccount model
  lanes: ILaneWithTicketsAndTags[]; // Array of references to the Lane model
}

const PipelineSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  subAccount: {
    type: Types.ObjectId,
    ref: "SubAccount", // reference to the SubAccount model
    required: true,
  },
  lanes: [{ type: Types.ObjectId, ref: "Lane" }], // Array of references to the Lane model
});

const Pipeline = models.Pipeline || model("Pipeline", PipelineSchema);

export default Pipeline;
