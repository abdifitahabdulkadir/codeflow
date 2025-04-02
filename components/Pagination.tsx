"use client";

import { updateUrlQueryParams } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface Props {
  page: string | number | undefined;
  isNext: boolean;
  containerClasses?: string;
}
export default function Pagination({ page, isNext, containerClasses }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleNavigation(type: "prev" | "next") {
    const nextPageNumber =
      type === "prev"
        ? Number(page) - 1 <= 0
          ? 1
          : Number(page) - 1
        : Number(page) + 1;

    const newUrl = updateUrlQueryParams({
      key: "page",
      value: String(nextPageNumber),
    });

    router.push(newUrl);
  }

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center gap-3",
        containerClasses,
      )}
    >
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-400 px-4 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
}
