"use server";

import { UserModel } from "@/database";
import { PaginatedSearchParams, UserParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import { FilterQuery } from "mongoose";
import { actionHandler } from "../handlers/action.handler";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getUsers(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: UserParams[]; isNext: boolean }>> {
  const validationResult = await actionHandler({
    params,
    authorize: true,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return handleError("server", validationResult) as ErrorResponse;

  const { page, filter, query, pageSize = 10 } = params;
  const skip = Number(page) - 1 * pageSize;
  const userId = validationResult.session?.user?.id;

  const filterQuery: FilterQuery<UserParams> = {};
  if (query) {
    filterQuery.$or = [
      {
        name: { $regex: new RegExp(query, "i") },
      },
      {
        email: { $regex: new RegExp(query, "i") },
      },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "popular":
      sortCriteria = { repuation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const countUsers = await UserModel.countDocuments(filterQuery);

    const users = await UserModel.find(filterQuery)
      .skip(skip)
      .limit(pageSize)
      .sort(sortCriteria);

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext: countUsers > skip + users.length,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
