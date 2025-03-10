"use server";

import { QuestionModel, TagModel } from "@/database";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import { Error, FilterQuery } from "mongoose";
import { actionHandler } from "../handlers/action.handler";
import handleError from "../handlers/error";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getTags(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: TagI[]; isNext: boolean }>> {
  const validatedParams = await actionHandler({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validatedParams instanceof Error)
    return handleError("server", validatedParams) as ErrorResponse;

  const { page = 0, query, pageSize = 10, filter } = params;
  const skip = (page - 1) * pageSize;

  const filterQuery: FilterQuery<TagI> = {};

  if (query)
    filterQuery.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
    ];

  let sortCriteria = {};
  switch (filter) {
    case "popular":
      sortCriteria = { usage: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { usage: -1 };
      break;
  }
  try {
    const totalTags = await TagModel.countDocuments(filterQuery);
    const tags = await TagModel.find(filterQuery)
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext: totalTags > skip + tags.length,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}

export async function getTagQuestions(
  params: GetTagQuestionParams,
): Promise<
  ActionResponse<{ tag: TagI; questions: QuestionI[]; isNext: boolean }>
> {
  const validatedParams = await actionHandler({
    params,
    schema: GetTagQuestionsSchema,
    authorize: true,
  });

  if (validatedParams instanceof Error)
    return handleError("server", validatedParams) as ErrorResponse;

  try {
    const { page = 0, query, pageSize = 10, tagId } = params;
    const tag = await TagModel.findById(tagId);

    if (!tag) throw new Error("Tag not found");
    const skip = (page - 1) * pageSize;

    const filterQuery: FilterQuery<QuestionI> = {
      tags: { $in: [tagId] },
    };
    if (query) filterQuery.title = { $regex: query, $options: "i" };

    const totalTagQuestions = await QuestionModel.countDocuments(filterQuery);
    const tagQuestions = await QuestionModel.find(filterQuery)
      .select("_id title views upVotes downVotes answers createdAt authorId ")
      .populate([
        {
          path: "authorId",
          select: "name image",
        },
        { path: "tags", select: "name" },
      ])
      .lean()
      .skip(skip)
      .limit(pageSize);

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(tagQuestions)),
        isNext: totalTagQuestions > skip + tagQuestions.length,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
