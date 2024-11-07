import { model, models, Schema, Types } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  tags: string[];
  views: number;
  upVotes: number;
  downVotes: number;
  answers: number;
}
const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String },
    content: { type: String },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Question =
  models?.Quesion || model<IQuestion>("Question", QuestionSchema);

export default Question;
