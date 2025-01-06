import { model, models, Schema, Types } from "mongoose"

export interface InteractionDoc {
  _id?: Types.ObjectId
  user: Types.ObjectId
  actionId: Types.ObjectId
  action: string
  actionType: "question" | "answer"
}
const InteractionSchema = new Schema<InteractionDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
)

const InteractionModel =
  models?.InteractionModel ||
  model<InteractionDoc>("InteractionModel", InteractionSchema)

export default InteractionModel
