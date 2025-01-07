"use server";

import QuestionModel, { QuestionDoc } from "@/database/question.model";
import TagQuestionModel from "@/database/tag-quesition.model";
import TagModel, { TagDoc } from "@/database/tags.model";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import console from "console";
import mongoose from "mongoose";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionDetailSchema,
} from "../validations";

// create question server action
export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<QuestionDoc>> {
  const validateParams = await actionHandler({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validateParams instanceof Error)
    return handleError("server", validateParams) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { content, tags, title } = validateParams.params!;
  const userId = validateParams.session?.user?.id;
  let transactionComplelete = false;
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
    );
    if (!question) throw new Error("Failed to create question");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const TagQuestionDoc = [];

    for (const tag of tags) {
      // create tag if not exist other update usage to +1
      // becuaseo f upsert to true then it create new docs by combining
      // both filter and update object. -- sets tag name to the givne one
      // and increment usage by 1
      const existingTag = await TagModel.findOneAndUpdate(
        { name: { $regex: `^${tag}$`, $options: "i" } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );

      tagIds.push(existingTag._id);
      TagQuestionDoc.push({
        tagId: existingTag._id,
        questionId: question._id,
      });
    }

    // update question by adding new tag so it will be tag associated with this quesition.
    // also create tag question document to associate tag with question.
    await TagQuestionModel.insertMany(TagQuestionDoc, { session });
    //  $push: { tags: { $each: tagIds } }, adds all given tagId to the
    // array obejct [tags] in the question document.
    // each means iterativing.
    await QuestionModel.findOneAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session },
    );

    await session.commitTransaction();
    transactionComplelete = true;
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    if (transactionComplelete === false) session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

// edit question server action
export async function editQuestion(
  params: EditQuestionParams,
): Promise<ActionResponse<QuestionDoc>> {
  const validateParams = await actionHandler({
    schema: EditQuestionSchema,
    params,
    authorize: true,
  });

  if (validateParams instanceof Error)
    return handleError("server", validateParams) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { content, tags, title, questionId } = validateParams.params!;
    const userId = validateParams.session?.user?.id;

    const question = await QuestionModel.findById(questionId).populate("tags");
    console.log(question);
    if (!question) throw new Error("Question not found");

    if (question.authorId.toString() !== userId)
      throw new Error("You are not authorized to edit this question");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // find  added or removed tags
    const addedTags = tags.filter(
      (tag) => !question.tags.includes(tag.toLocaleLowerCase()),
    );
    const removedTags = question.tags.filter(
      (tag: TagDoc) => !tags.includes(tag.name.toLocaleLowerCase()),
    );

    const TagQuestionDoc = [];
    // if author added new tags
    if (addedTags.length > 0) {
      for (const tag of addedTags) {
        const existingTag = await TagModel.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );

        // this will be used to create tag question model doc
        TagQuestionDoc.push({
          tagId: existingTag._id,
          questionId,
        });
        question.tags.push(existingTag._id);
      }
    }

    // if auther removed tags
    if (removedTags.length > 0) {
      const tagsToRemoveIds = removedTags.map((tag: TagDoc) => tag._id);

      // update thier docs by decrementing usage by 1 -
      // because they might have been asscoaited with other questions.
      await TagModel.updateMany(
        { _id: { $in: tagsToRemoveIds } },
        { $inc: { questions: -1 } },
        { session },
      );

      // remove connection between those removed tags and current question
      await TagQuestionModel.deleteMany(
        { tagId: { $in: tagsToRemoveIds }, questionId },
        { session },
      );

      // filter out current tags if any one of removed tag's id is included
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) => !tagsToRemoveIds.includes(tag),
      );
    }

    // if there any quesitonTag docs then save -- new relationship
    // current question and new tags being added.
    if (TagQuestionDoc.length > 0) {
      await TagQuestionModel.insertMany(TagQuestionDoc, { session });
    }

    // now save question
    await question.save({ session });

    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// get question detail server action
export async function getQuestionDetail(params: GetQuestionParams) {
  const validateParams = await actionHandler({
    schema: GetQuestionDetailSchema,
    params,
    authorize: true,
  });

  if (validateParams instanceof Error)
    return handleError("server", validateParams) as ErrorResponse;

  try {
    const { questionId } = validateParams.params!;
    const question = await QuestionModel.findOne({
      _id: questionId,
    }).populate("tags");

    if (!question) throw new Error("Not Found Question");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
