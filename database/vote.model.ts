import { model, models, Schema, Types } from "mongoose";

export interface VoteDoc {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: "question" | "answer";
  voteType: "upvote" | "downvote";
}
const VoteSchema = new Schema<VoteDoc>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["question", "answer"],
      reqiured: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      reqiured: true,
    },
  },
  {
    timestamps: true,
  },
);

const VoteModel = models?.Vote || model<VoteDoc>("Vote", VoteSchema);

export default VoteModel;
