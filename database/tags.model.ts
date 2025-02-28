import { model, models, Schema, Types } from "mongoose";

export interface TagDoc {
  _id?: Types.ObjectId;
  name: string;
  usage: number;
}

const TagSchema = new Schema<TagDoc>({
  name: {
    type: String,
    required: true,
  },
  usage: {
    type: Number,
    default: 0,
  },
});

const TagModel = models?.Tag || model<TagDoc>("Tag", TagSchema);

export default TagModel;
