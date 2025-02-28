import { model, models, Schema, Types } from "mongoose";
import QuestionModel from "./question.model";
import TagModel from "./tags.model";

export interface TagQuestionDoc {
  tagId: Types.ObjectId;
  questionId: Types.ObjectId;
}
const TagQuestionSchema = new Schema<TagQuestionDoc>({
  tagId: { type: Schema.Types.ObjectId, required: true, ref: TagModel },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: QuestionModel,
  },
});

const TagQuestionModel =
  models.TagQuestion || model<TagQuestionDoc>("TagQuestion", TagQuestionSchema);

export default TagQuestionModel;
