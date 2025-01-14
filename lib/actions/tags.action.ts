"use server";

import { TagModel } from "@/database";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/glabal";
import { FilterQuery } from "mongoose";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validations";

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
