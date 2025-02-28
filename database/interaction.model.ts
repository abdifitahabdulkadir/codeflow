import { model, models, Schema, Types } from "mongoose";
import UserModel from "./user.model";

export interface InteractionDoc {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  actionId: Types.ObjectId;
  action: string;
  actionType: "question" | "answer";
}
const InteractionSchema = new Schema<InteractionDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    action: {
      type: String,
      required: true,
    },
    actionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const InteractionModel =
  models?.Interaction ||
  model<InteractionDoc>("Interaction", InteractionSchema);

export default InteractionModel;
