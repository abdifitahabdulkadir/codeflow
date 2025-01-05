import { model, models, Schema, Types } from 'mongoose'

export interface ITagQuestion {
  tagId: Types.ObjectId
  questionId: Types.ObjectId
}
const TagQuestionSchema = new Schema<ITagQuestion>({
  tagId: { type: Schema.Types.ObjectId, required: true, ref: 'Tag' },
  questionId: { type: Schema.Types.ObjectId, required: true, ref: 'Question' },
})

const TagQuestion =
  models.TagQuestion || model<ITagQuestion>('TagQuestion', TagQuestionSchema)

export default TagQuestion
