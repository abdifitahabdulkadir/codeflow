"use client";

import { removeUrlQueryParams, updateUrlQueryParams } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../../components/ui/button";

const filters = [
  {
    name: "Newest",
    value: "newest",
  },
  {
    name: "Popular",
    value: "Popular",
  },
  {
    name: "Recommended",
    value: "recommended",
  },
  {
    name: "Unanswered",
    value: "unanswered",
  },
];

export default function HomeFilters() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(filter);

  const handleOnClick = (filterValue: string) => {
    if (filterValue && filterValue !== activeFilter) {
      setActiveFilter(filterValue);
      const newUrl = updateUrlQueryParams({
        params: searchParams.toString(),
        key: "filter",
        value: filterValue,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActiveFilter("");
      const newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-6 flex w-full flex-wrap gap-3">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          className={cn(
            `body-medium shadow-none" rounded-lg px-6 py-3 capitalize`,
            activeFilter === filter.value
              ? "bg-primary-100 text-primary-400 hover:bg-primary-100 dark:bg-dark-300 dark:text-primary-400 dark:hover:bg-dark-400"
              : "text-light-200 bg-light-800 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400",
          )}
          onClick={() => handleOnClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
}
