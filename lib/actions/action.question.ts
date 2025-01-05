'use server'

import Question, { IQuestion } from '@/database/question.model'
import TagQuestion from '@/database/tag-quesition.model'
import Tag from '@/database/tags.model'
import { ActionResponse, ErrorResponse } from '@/types/glabal'
import mongoose from 'mongoose'
import { actionHandler } from '../handlers/action'
import handleError from '../handlers/error'
import { AskQuestionSchema } from '../validations'

export async function createQuestion(
  params: CreateQuestionProps,
): Promise<ActionResponse<IQuestion>> {
  const validateParams = await actionHandler({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  })
  console.log(validateParams)
  if (validateParams instanceof Error)
    return handleError('server', validateParams) as ErrorResponse

  const session = await mongoose.startSession()
  session.startTransaction()

  const { content, tags, title } = validateParams.params!
  const userId = validateParams.session?.user?.id
  try {
    // if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    //   throw new Error('Invalid ObjectId format')
    // }
    // create question
    const [question] = await Question.create(
      [
        {
          title,
          content,
          authorId: new mongoose.Types.ObjectId(userId),
        },
      ],
      {
        session,
      },
    )
    if (!question) throw new Error('Failed to create question')

    const tagIds: mongoose.Types.ObjectId[] = []
    const TagQuestionDoc = []

    for (const tag of tags) {
      // create tag if not exist other update usage to +1
      // becuaseo f upsert to true then it create new docs by combining
      // both filter and update object. -- sets tag name to the givne one
      // and increment usage by 1
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, 'i'),
          },
        },
        {
          $setOnInsert: { name: tag },
          $inc: { usage: 1 },
        },
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
    await TagQuestion.insertMany(TagQuestionDoc, { session })
    //  $push: { tags: { $each: tagIds } }, adds all given tagId to the
    // array obejct [tags] in the question document.
    // each means iterativing.
    await Question.findOneAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session },
    )

    await session.commitTransaction()
    return { success: true, data: JSON.parse(JSON.parse(question)) }
  } catch (error) {
    console.log(error)
    session.abortTransaction()
    return handleError('server', error) as ErrorResponse
  } finally {
    session.endSession()
  }
}
