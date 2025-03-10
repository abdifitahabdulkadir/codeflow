import { model, models, Schema, Types } from "mongoose";
import TagModel from "./tags.model";
import UserModel from "./user.model";

export interface QuestionDoc {
  _id?: Types.ObjectId | string;
  title?: string;
  content?: string;
  authorId: Types.ObjectId;
  tags?: Types.ObjectId[];
  views: number;
  upVotes: number;
  downVotes: number;
  answers: number;
  createdAt: Date;
}
const QuestionSchema = new Schema<QuestionDoc>(
  {
    title: { type: String },
    content: { type: String },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: TagModel }],
    views: { type: Number, min: 0, default: 0 },
    upVotes: { type: Number, min: 0, default: 0 },
    downVotes: { type: Number, min: 0, default: 0 },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const QuestionModel =
  models?.Question || model<QuestionDoc>("Question", QuestionSchema);

export default QuestionModel;
