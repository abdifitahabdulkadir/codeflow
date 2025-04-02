"use server";

import { ROUTES } from "@/constants/routes";
import { CollectionModel, QuestionModel } from "@/database";
import { QuestionDoc } from "@/database/question.model";
import {
  CollectionBasedParams,
  CollectionI,
  PaginatedSearchParams,
} from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { actionHandler } from "../handlers/action.handler";
import handleError from "../handlers/error";
import {
  CollectionBasedSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function toggleSaveToCollection(
  params: CollectionBasedParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await actionHandler({
    params,
    schema: CollectionBasedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { questionId } = params;
  const author = validationResult.session?.user?.id;

  try {
    const question = await QuestionModel.findOne({
      _id: questionId,
      authorId: author,
    });
    if (!question) throw new Error("Question not found");

    const collectionExisted = await CollectionModel.findOne({
      author,
      question: questionId,
    });

    if (collectionExisted) {
      await CollectionModel.findOneAndDelete({
        author,
        question: questionId,
      });
      revalidatePath(ROUTES.QUESIONS(questionId));
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await CollectionModel.create([
      {
        author,
        question: questionId,
      },
    ]);
    revalidatePath(ROUTES.QUESIONS(questionId));
    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBasedParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await actionHandler({
    params,
    schema: CollectionBasedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { questionId } = params;
  const author = validationResult.session?.user?.id;

  try {
    const collectionExisted = await CollectionModel.findOne({
      author,
      question: questionId,
    });

    return {
      success: true,
      data: {
        saved: !!collectionExisted,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}

// get all questions saved in the collection.
export async function getSaveQuestions(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    collection: CollectionI[];
    isNext: boolean;
  }>
> {
  const validatedResult = await actionHandler({
    schema: PaginatedSearchParamsSchema,
    params,
    authorize: true,
  });

  if (validatedResult instanceof Error)
    return handleError("server", validatedResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (page - 1) * pageSize;
  const userId = validatedResult.session?.user?.id;

  const filterQuery: FilterQuery<QuestionDoc> = { author: userId };

  if (query) {
    filterQuery.$or = [
      {
        title: {
          $regex: new RegExp(query, "i"),
        },
      },
      {
        content: {
          $regex: new RegExp(query, "i"),
        },
      },
    ];
  }

  let sortCriteria = {};
  switch (filter) {
    case "mostrecent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: -1 };
      break;

    case "mostvoted":
      sortCriteria = { upVotes: -1 };
      break;
    case "mostanswered":
      sortCriteria = { answers: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await CollectionModel.countDocuments(filterQuery);
    const saveQuestions = await CollectionModel.find(filterQuery)
      .populate({
        path: "question",
        populate: [
          {
            path: "tags",
            select: "name",
          },
          {
            path: "authorId",
            select: "name image",
          },
        ],
      })
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + saveQuestions.length;

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(saveQuestions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
