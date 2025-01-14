"use server";

import QuestionModel, { QuestionDoc } from "@/database/question.model";
import TagQuestionModel from "@/database/tag-quesition.model";
import TagModel, { TagDoc } from "@/database/tags.model";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import mongoose, { FilterQuery } from "mongoose";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionDetailSchema,
  PaginatedSearchParamsSchema,
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
        { $setOnInsert: { name: tag }, $inc: { usage: 1 } },
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
    if (!question) throw new Error("Question not found");

    if (question.authorId.toString() !== userId)
      throw new Error("You are not authorized to edit this question");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }
    // find  added tags
    const addedTags = tags.filter(
      (tag: string) =>
        !question.tags.some((eachTage: TagDoc) =>
          eachTage.name.toLowerCase().includes(tag.toLowerCase()),
        ),
    );

    // find removed tags
    const removedTags = question.tags.filter(
      (tag: TagDoc) =>
        !tags.some((eachTag: string) =>
          eachTag.toLowerCase().includes(tag.name.toLowerCase()),
        ),
    );

    const TagQuestionDoc = [];
    // if author added new tags
    if (addedTags.length > 0) {
      for (const tag of addedTags) {
        const existingTag = await TagModel.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { usage: 1 } },
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
      const tagsToRemoveIds: mongoose.Types.ObjectId[] = removedTags.map(
        (tag: TagDoc) => tag._id,
      );
      const tagsHasMoreUsage: mongoose.Types.ObjectId[] = [];

      // delete tags that has 0 questions related or negative
      // as we decrementing so then value can be be negative
      for (const eachToRemoveId of tagsToRemoveIds) {
        const eachTag = await TagModel.findById(eachToRemoveId);
        if (eachTag.usage === 0 || eachTag.usage < 0)
          await TagModel.deleteOne(
            {
              _id: eachTag,
            },
            { session },
          );
        else {
          tagsHasMoreUsage.push(eachTag);
        }
      }
      // update thier docs by decrementing usage by 1 -
      // because they might have been asscoaited with other questions.
      if (tagsHasMoreUsage.length > 0)
        await TagModel.updateMany(
          { _id: { $in: tagsHasMoreUsage } },
          { $inc: { usage: -1 } },
          { session },
        );

      // remove connection between those removed tags and current question
      // because we have just decremented now so we have to cut the
      // conneciton between those tags and current connection
      await TagQuestionModel.deleteMany(
        { tagId: { $in: tagsHasMoreUsage }, questionId },
        { session },
      );

      // filter out current tags if any one of removed tag's id is included
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagsHasMoreUsage.some((eachTag) =>
            String(eachTag).toLowerCase().includes(String(tag).toLowerCase()),
          ),
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

// get  single question detail server action
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

// get all questions server action -filtered and paginated
export async function getQuestions(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    questions: QuestionI[];
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

  const filterQuery: FilterQuery<QuestionDoc> = {};

  if (filter === "recommended")
    return {
      success: true,
      data: {
        isNext: false,
        questions: [],
      },
    };

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
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;

    case "Popular":
      sortCriteria = { upVotes: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await QuestionModel.countDocuments(filterQuery);
    const questions = await QuestionModel.find(filterQuery)
      .populate("tags", "name")
      .populate("authorId", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
