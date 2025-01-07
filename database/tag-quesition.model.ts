import { model, models, Schema, Types } from "mongoose";

export interface TagQuestionDoc {
  tagId: Types.ObjectId;
  questionId: Types.ObjectId;
}
const TagQuestionSchema = new Schema<TagQuestionDoc>({
  tagId: { type: Schema.Types.ObjectId, required: true, ref: "TagModel" },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "QuestionModel",
  },
});

const TagQuestionModel =
  models.TagQuestionModel ||
  model<TagQuestionDoc>("TagQuestionModel", TagQuestionSchema);

export default TagQuestionModel;
