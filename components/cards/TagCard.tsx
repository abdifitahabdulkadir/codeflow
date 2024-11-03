"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { getDevCLass } from "@/lib/utils";
import Image from "next/image";
interface ProsType {
  _id: string;
  name: string;
  quesionsCount?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
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
  showCount,
}: ProsType) {
  const className = getDevCLass(name);

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
  if (isButton)
    return isButton ? (
      <div>{contnet}</div>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {contnet}
      </Link>
    );
}
