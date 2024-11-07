import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: "question" | "answer";
  voteType: "upvote" | "downvote";
}
const VoteSchema = new Schema<IVote>(
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

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
