import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  imageUrl: string;
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
  console.log(imageUrl);
  const metricContnet = (
    <>
      <Image
        src={imageUrl}
        alt={alt}
        width={20}
        height={20}
        priority
        loading="eager"
        className={cn("rounded-full object-contain")}
      />
      <p className={`${textStyles} flex items-center gap-1.5`}>
        {title}
        {isAuthor && (
          <span className="text-dark400_light700 max-sm:hidden">•</span>
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
    <Link href={href} className="flex-center gap-1">
      {metricContnet}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContnet}</div>
  );
}
