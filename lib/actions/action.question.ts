"use server"

import QuestionModel, { QuestionDoc } from "@/database/question.model"
import TagQuestionModel from "@/database/tag-quesition.model"
import TagModel from "@/database/tags.model"
import { ActionResponse, ErrorResponse } from "@/types/glabal"
import mongoose from "mongoose"
import { actionHandler } from "../handlers/action"
import handleError from "../handlers/error"
import { AskQuestionSchema } from "../validations"

export async function createQuestion(
  params: CreateQuestionProps,
): Promise<ActionResponse<QuestionDoc>> {
  const validateParams = await actionHandler({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  })
  if (validateParams instanceof Error)
    return handleError("server", validateParams) as ErrorResponse

  const session = await mongoose.startSession()
  session.startTransaction()

  const { content, tags, title } = validateParams.params!
  const userId = validateParams.session?.user?.id
  let transactionComplelete = false
  try {
    // create question
    const [question] = await QuestionModel.create(
      [
        {
          title,
          content,
          authorId: userId,
        },
      ],
      {
        session,
      },
    )
    if (!question) throw new Error("Failed to create question")

    const tagIds: mongoose.Types.ObjectId[] = []
    const TagQuestionDoc = []

    for (const tag of tags) {
      // create tag if not exist other update usage to +1
      // becuaseo f upsert to true then it create new docs by combining
      // both filter and update object. -- sets tag name to the givne one
      // and increment usage by 1
      const existingTag = await TagModel.findOneAndUpdate(
        { name: { $regex: `^${tag}$`, $options: "i" } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      )

      tagIds.push(existingTag._id)
      TagQuestionDoc.push({
        tagId: existingTag._id,
        questionId: question._id,
      })
    }

    // update question by adding new tag so it will be tag associated with this quesition.
    // also create tag question document to associate tag with question.
    await TagQuestionModel.insertMany(TagQuestionDoc, { session })
    //  $push: { tags: { $each: tagIds } }, adds all given tagId to the
    // array obejct [tags] in the question document.
    // each means iterativing.
    await QuestionModel.findOneAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session },
    )

    await session.commitTransaction()
    transactionComplelete = true
    return { success: true, data: JSON.parse(JSON.stringify(question)) }
  } catch (error) {
    console.log(error)
    if (transactionComplelete === false) session.abortTransaction()
    return handleError("server", error) as ErrorResponse
  } finally {
    session.endSession()
  }
}
