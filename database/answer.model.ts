import { model, models, Schema, Types } from "mongoose";
import QuestionModel from "./question.model";
import UserModel from "./user.model";

export interface AnswerDoc {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId;
  questionId: Types.ObjectId;
  content: string;
  upVotes: number;
  downVotes: number;
}
const AnswerSchmea = new Schema<AnswerDoc>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: QuestionModel,
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

const AnswerModel = models.Answer || model<AnswerDoc>("Answer", AnswerSchmea);
export default AnswerModel;
