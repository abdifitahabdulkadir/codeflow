import { model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  authorId: Types.ObjectId;
  questionId: Types.ObjectId;
  content: string;
  upVotes: number;
  downVotes: number;
}
const AnswerSchmea = new Schema<IAnswer>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
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
