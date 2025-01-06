import { model, models, Schema, Types } from "mongoose"

export interface TagQuestionDoc {
  tagId: Types.ObjectId
  questionId: Types.ObjectId
}
const TagQuestionSchema = new Schema<TagQuestionDoc>({
  tagId: { type: Schema.Types.ObjectId, required: true, ref: "Tag" },
  questionId: { type: Schema.Types.ObjectId, required: true, ref: "Question" },
})

const TagQuestionModel =
  models.TagQuestionModel ||
  model<TagQuestionDoc>("TagQuestionModel", TagQuestionSchema)

export default TagQuestionModel
