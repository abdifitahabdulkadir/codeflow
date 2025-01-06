import { model, models, Schema, Types } from "mongoose"

export interface QuestionDoc {
  _id?: Types.ObjectId | string
  title: string
  content: string
  authorId: Types.ObjectId
  tags: Types.ObjectId | string[]
  views: number
  upVotes: number
  downVotes: number
  answers: number
}
const QuestionSchema = new Schema<QuestionDoc>(
  {
    title: { type: String },
    content: { type: String },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const QuestionModel =
  models?.QuestionModel || model<QuestionDoc>("QuestionModel", QuestionSchema)

export default QuestionModel
