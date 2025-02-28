import { model, models, Schema, Types } from "mongoose";
import QuestionModel from "./question.model";
import UserModel from "./user.model";

export interface CollectionDoc {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  question: Types.ObjectId;
}
const CollectionSchema = new Schema<CollectionDoc>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    question: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: QuestionModel,
    },
  },
  { timestamps: true },
);

const CollectionModel =
  models?.Collection || model<CollectionDoc>("Collection", CollectionSchema);

export default CollectionModel;
