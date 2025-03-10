"use server";

import { ROUTES } from "@/constants/routes";
import { AnswerModel, QuestionModel, VoteModel } from "@/database";
import { VoteDoc } from "@/database/vote.model";
import {
  CreateVoteCountParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVotecountParams,
} from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import mongoose, { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";
import { actionHandler } from "../handlers/action.handler";
import handleError from "../handlers/error";
import {
  CreateVoteCountSchema,
  HasVotedResponseSchema,
  UpdateVotecountSchema,
} from "../validations";

// updating the vote of answer or question as user downvote or upvote
export async function updateVoteCount(
  params: UpdateVotecountParams,
  session: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await actionHandler({
    params,
    schema: UpdateVotecountSchema,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { targetId, targetType, voteType, change } = params;

  const model = targetType === "question" ? QuestionModel : AnswerModel;
  const upvoteFiled = voteType === "downvote" ? "downVotes" : "upVotes";

  try {
    const result = await model.findByIdAndUpdate(
      targetId,
      {
        $inc: {
          [upvoteFiled]: change,
        },
      },
      { new: true, session },
    );
    if (!result) throw new Error("Failed to do Vote count");
    return { success: true };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}

// creating the vote
export async function createVoteCount(
  params: CreateVoteCountParams,
  pathId: string,
): Promise<ActionResponse> {
  const validationResult = await actionHandler({
    params,
    schema: CreateVoteCountSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { targetId, targetType, voteType } = params;
  const userId = validationResult?.session?.user?.id;
  if (!userId)
    return handleError("server", new Error("User not found")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingVote = await VoteModel.findOne<VoteDoc>({
      contentId: targetId,
      author: userId,
      contentType: targetType,
    }).session(session);

    if (existingVote) {
      // if user has already voted with same vote e.g upvtote
      // and trying to vote same one again then toggle the value
      if (existingVote.voteType === voteType) {
        await VoteModel.deleteOne({
          _id: existingVote._id,
        }).session(session);

        await updateVoteCount(
          {
            ...params,
            change: -1,
          },
          session,
        );
      }

      // otherwise change the vote type
      // (if previous was 'upvote' now to 'downvote')
      else {
        await VoteModel.findByIdAndUpdate(
          existingVote._id,
          {
            voteType,
          },
          { new: true, session },
        );

        // decrement count of previos vote by one as we changed it
        await updateVoteCount(
          { ...params, voteType: existingVote.voteType, change: -1 },
          session,
        ),
          //increment count of curretn vote type by one
          await updateVoteCount(
            { ...params, voteType: voteType, change: 1 },
            session,
          );
      }
    }

    //create new one
    else {
      await VoteModel.create<VoteDoc>(
        [
          {
            author: userId,
            contentId: targetId,
            contentType: targetType,
            voteType,
          },
        ],
        { session },
      );
      await updateVoteCount(
        { targetType, targetId, voteType, change: 1 },
        session,
      );
    }

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESIONS(pathId));
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// get weather current user is upvoted or
// downvoted on specific question or anwwer

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await actionHandler({
    params,
    schema: HasVotedResponseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const userId = validationResult.session?.user?.id;
  if (!userId)
    return handleError(
      "server",
      new Error("Only logged in user can do "),
    ) as ErrorResponse;
  const { targetId, targetType } = params;

  try {
    const vote = await VoteModel.findOne<VoteDoc>({
      contentId: targetId,
      contentType: targetType,
      author: userId,
    });

    if (!vote)
      return {
        success: false,
        data: {
          hasDownVoted: false,
          hasUpvoted: false,
        },
      };

    return {
      success: true,
      data: {
        hasDownVoted: vote.voteType === "downvote",
        hasUpvoted: vote.voteType === "upvote",
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
