import { model, models, Schema, Types } from "mongoose"

export interface CollectionDoc {
  _id: Types.ObjectId
  author: Types.ObjectId
  question: Types.ObjectId
}
const CollectionSchema = new Schema<CollectionDoc>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    question: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
  },
  { timestamps: true },
)

const CollectionModel =
  models?.CollectionModel ||
  model<CollectionDoc>("CollectionModel", CollectionSchema)

export default CollectionModel
