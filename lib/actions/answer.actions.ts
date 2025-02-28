"use server";

import { AnswerModel, QuestionModel } from "@/database";
import { AnswerI, CreateAnswerParams, GetAnswersParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import { CreateAnswerSchema, GetAnswersSchema } from "../validations";

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<AnswerI>> {
  const validationResult = await actionHandler({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult.message) as ErrorResponse;

  const { content, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await QuestionModel.findById(questionId).session(session);

    if (!question) throw new Error("Quesion not found");

    const [newAnswer] = await AnswerModel.create(
      [
        {
          authorId: userId,
          questionId,
          content,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to post answer");

    // update number of answer associate with current question
    question.answers += 1;

    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(`/questions/${questionId}`);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    if (!session.commitTransaction) await session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(params: GetAnswersParams): Promise<
  ActionResponse<{
    isNext: boolean;
    answers: AnswerI[];
    totalAnswers: number;
  }>
> {
  const validationResult = await actionHandler({
    params,
    authorize: true,
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { page = 1, filter, pageSize = 10, query, questionId } = params;
  const skip = (Number(page) - 1) * pageSize;

  let sortedCriteria = {};
  switch (filter) {
    case "latest":
      sortedCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortedCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortedCriteria = { upVotes: -1 };
      break;
    default:
      sortedCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await AnswerModel.countDocuments({
      questionId: questionId,
    });
    const answers = await AnswerModel.find({ questionId: questionId })
      .populate("authorId", "_id name image")
      .sort(sortedCriteria)
      .skip(skip)
      .limit(pageSize);

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext: totalAnswers > skip + answers.length,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
