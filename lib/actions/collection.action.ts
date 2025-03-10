"use server";

import { ROUTES } from "@/constants/routes";
import { CollectionModel, QuestionModel } from "@/database";
import { CollectionBasedParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import { revalidatePath } from "next/cache";
import { actionHandler } from "../handlers/action.handler";
import handleError from "../handlers/error";
import { CollectionBasedSchema } from "../validations";

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

    const collectionExisted = await CollectionModel.find({
      author,
      question: questionId,
    });

    if (collectionExisted) {
      await CollectionModel.findOneAndDelete({
        author,
        question: questionId,
      });

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
