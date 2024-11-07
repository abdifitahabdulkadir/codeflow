import { model, models, Schema } from "mongoose";

export interface ITag {
  name: string;
  usage: number;
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
  },
  usage: {
    type: Number,
    default: 0,
  },
});

const Tag = models?.Tag || model("Tag", TagSchema);

export default Tag;
