import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import CustomAvator from "@/components/customAvator";
import Preview from "@/components/Editor/Preview";
import AnswerForm from "@/components/Forms/AnswerForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import Vote from "@/components/Votes/Vote";
import { ROUTES } from "@/constants/routes";
import {
  getQuestionDetail,
  incrementViews,
} from "@/lib/actions/action.question";
import { getAnswers } from "@/lib/actions/answer.actions";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { hasVoted } from "@/lib/actions/vote.actions";

import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { TagI } from "@/types/action";
import { RouteParams } from "@/types/glabal";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";

// component of question Details.
export default async function QuestionDetailPage({
  params,
  searchParams,
}: RouteParams) {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;
  const { data: question, success } = await getQuestionDetail({
    questionId: id,
  });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success) redirect("/404");

  const {
    authorId,
    _id,
    createdAt,
    answers: numberOfAnswers,
    views,
    tags,
    title,
    content,
    upVotes,
    downVotes,
  } = question;

  const {
    success: areAnswersLoaded,
    data: answers,
    errors: answerError,
  } = await getAnswers({
    questionId: id,
    filter: filter,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const votePromise = hasVoted({
    targetId: _id,
    targetType: "question",
  });
  const hasSavedPromise = hasSavedQuestion({
    questionId: _id,
  });

  return (
    <>
      <div className="flex-start  w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <CustomAvator userId={authorId._id} name={authorId.name} />
            <Link href={ROUTES.PROFILE(authorId._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {authorId.name}
              </p>
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <Suspense fallback={<div> loading...</div>}>
              <Vote
                targetId={_id}
                targetType="question"
                votePromise={votePromise}
                downVotes={downVotes}
                upVotes={upVotes}
              />
            </Suspense>
            <Suspense fallback={<div> loading...</div>}>
              <SaveQuestion questionId={_id} hasSavePromise={hasSavedPromise} />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark300_light900  mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="flex w-full gap-2 flex-wrap mt-4">
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/clock.svg"}
          alt="clock icon"
          value={""}
          title={`Asked ${formatTimeAgo(new Date(createdAt))}`}
        />
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/message.svg"}
          alt="message icon"
          value={""}
          title={formatNumber(numberOfAnswers)}
        />
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/eye.svg"}
          alt="clock icon"
          value={""}
          title={formatNumber(views)}
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((each: TagI) => {
          return (
            <TagCard
              key={each._id}
              _id={each._id as string}
              name={each.name}
              compact
            />
          );
        })}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answers?.answers}
          totalAnswers={answers?.totalAnswers || 0}
          success={areAnswersLoaded}
          errors={answerError}
        />
      </section>

      <section className="mt-6">
        <AnswerForm
          question={question.title}
          content={question.content}
          questionId={question._id}
        />
      </section>
    </>
  );
}
