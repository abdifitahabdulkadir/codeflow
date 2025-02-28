import { formatTimeAgo } from "@/lib/utils";
import { AnswerI } from "@/types/action";
import CustomAvator from "../customAvator";
import Preview from "../Editor/Preview";

export default function AnswerCard({
  _id,
  authorId,
  content,
  createdAt,
}: AnswerI) {
  return (
    <article className="light-border py-10 border-b">
      <span id={JSON.stringify(_id)} className="hash-span" />

      <div className="mb-5 flex flex-col  justify-between  gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start sm:items-center gap-1">
          <CustomAvator
            name={authorId.name ?? ""}
            userId={authorId._id}
            userImage={authorId.image}
          />
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center ml-1.5">
            <p className="ml-2 body-semibold text-dark300_light700">
              {authorId.name ?? "Anonymous "}
            </p>
            <p className="small-regular text-dark400_light500 line-clamp-1 ml-1.5 ">
              <span className="font-bold max-sm:hidden mr-1">&middot;</span>
              Answered {formatTimeAgo(createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-5 ">Votes</div>
      </div>

      <Preview content={content} />
    </article>
  );
}
