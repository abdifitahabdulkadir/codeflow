import TagCard from "@/components/cards/TagCard";
import CustomAvator from "@/components/customAvator";
import Preview from "@/components/Editor/Preview";
import Metric from "@/components/Metric";
import { ROUTES } from "@/constants/routes";
import {
  getQuestionDetail,
  incrementViews,
} from "@/lib/actions/action.question";
import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { RouteParams } from "@/types/glabal";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";

// component of question Details.
export default async function QuestionDetailPage({ params }: RouteParams) {
  const { id } = await params;

  const { data: question, success } = await getQuestionDetail({
    questionId: id,
  });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success) redirect("/404");
  const { authorId, createdAt, answers, views, tags, title, content } =
    question;

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
            <p> {views}</p>
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
          title={formatNumber(answers)}
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
    </>
  );
}
