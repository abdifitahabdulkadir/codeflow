import { ROUTES } from "@/constants/routes";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import Metric from "../Metric";
import TagCard from "./TagCard";

export default function QuesionCard({
  question: {
    createdAt,
    upvotes,
    views,
    _id,
    answerscount,
    author,
    tags,
    title,
  },
}: {
  question: Question;
}) {
  const time = formatTimeAgo(createdAt);
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {time}
        </span>
        <Link href={ROUTES.QUESION(_id)}>
          <h3 className="sm:semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map(({ _id, name }: Tag) => (
          <TagCard
            quesionsCount={answerscount}
            name={name}
            _id={_id}
            key={_id}
          ></TagCard>
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imageUrl={author.avatar}
          alt={author.name + " image "}
          title={author.name}
          value={`asked ${time}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="text-dark400_light700 body-medium"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imageUrl={"/icons/like.svg"}
            alt={"like icon"}
            value={`${upvotes}`}
            title={" Votes"}
            textStyles="text-dark400_light700 small-medium"
          />
          <Metric
            imageUrl={"/icons/message.svg"}
            alt={"message icon"}
            value={answerscount}
            title={" Answers"}
            textStyles="text-dark400_light700 small-medium"
          />
          <Metric
            imageUrl={"/icons/eye.svg"}
            alt={"views icon"}
            value={`${views}`}
            title={" Views"}
            textStyles="text-dark400_light700 small-medium"
          />
        </div>
      </div>
    </div>
  );
}
