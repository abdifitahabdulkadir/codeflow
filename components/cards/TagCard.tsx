"use client";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { getDevCLass, getTechDescription } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProsType {
  _id: string;
  name: string;
  quesionsCount?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  usage?: string;
  hasRemoveIcon?: boolean;
  onClick?: () => void;
}

export default function TagCard({
  _id,
  name,
  quesionsCount,
  isButton,
  hasRemoveIcon,
  onClick,
  usage,
  showCount,
  compact,
}: ProsType) {
  const className = getDevCLass(name);
  const description = getTechDescription(name);
  const contnet = (
    <>
      <Badge className="subtle-medium background-light800_dark300 rounded-md border-none px-4 py-2 uppercase">
        <div className="text-dark500_light500 flex items-center gap-x-2">
          <i className={className + " text-xs"}></i>
          {name}
          {hasRemoveIcon && (
            <Image
              onClick={onClick}
              alt="close icon"
              src="/icons/close.svg"
              width={12}
              height={12}
              priority
              loading="eager"
              className="cursor-pointer invert-0 dark:invert"
            />
          )}
        </div>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700 font-bold">
          {quesionsCount + "+"}
        </p>
      )}
    </>
  );
  if (compact) {
    return isButton ? (
      <div>{contnet}</div>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {contnet}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)}>
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px] ">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5 ">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={className} aria-hidden={true} />
        </div>
        <p className="small-regular text-dark500_light700  mt-5 line-clamp-3  w-full">
          {description}
        </p>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold  primary-text-gradient  mr-2.5">
            {usage}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
}
