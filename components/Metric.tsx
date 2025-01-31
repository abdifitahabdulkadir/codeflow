import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";

interface MetricProps {
  imageUrl: string | null;
  alt: string;
  value: string | number;
  title: string;
  textStyles: string;
  isAuthor?: boolean;
  href?: string;
}

export default function Metric({
  imageUrl,
  textStyles,
  isAuthor,
  value,
  title,
  alt,
  href,
}: MetricProps) {
  const metricContnet = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          width={20}
          height={20}
          priority
          loading="eager"
          className={cn("rounded-full object-contain")}
        />
      ) : (
        <CircleUser className="size-5" />
      )}

      <p className={`${textStyles} flex items-center gap-1`}>
        {title}
        {isAuthor && (
          <span className="text-dark-400 dark:text-light-700 max-sm:hidden">
            •
          </span>
        )}
        <span
          className={cn(
            "small-regular line-clamp-1",
            isAuthor ? "max-sm:hidden" : " ",
          )}
        >
          {value}
        </span>
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="flex items-center justify-center gap-1">
      {metricContnet}
    </Link>
  ) : (
    <div className="flex items-center justify-center gap-1">
      {metricContnet}
    </div>
  );
}
