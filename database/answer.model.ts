import { model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  answerId: Types.ObjectId;
  authorId: Types.ObjectId;
  quesionId: Types.ObjectId;
  content: string;
  upVotes: number;
  downVotes: number;
}
const AnswerSchmea = new Schema<IAnswer>(
  {
    answerId: { type: Schema.Types.ObjectId, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    quesionId: { type: Schema.Types.ObjectId, required: true, ref: "Quesion" },
    content: {
      type: String,
      required: true,
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchmea);
export default Answer;
