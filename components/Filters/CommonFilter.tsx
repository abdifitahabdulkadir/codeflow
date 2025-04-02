"use client";

import { cn } from "@/lib/utils";

import { updateUrlQueryParams } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses: string;
  containerClasses: string;
  route: string;
}
export default function CommonFilter({
  otherClasses,
  containerClasses,
  filters,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFilter = searchParams.get("filter");
  const hanldeFilterUpdate = (value: string) => {
    const newUrl = updateUrlQueryParams({
      value: value,
      key: "filter",
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={cn("mt-6 relative ", containerClasses)}>
      <Select
        onValueChange={hanldeFilterUpdate}
        defaultValue={activeFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border !text-dark500_light700 background-light800_dark300 border px-5 py-2.5",
            otherClasses,
          )}
          aria-label="filter options"
        >
          <div className="flex-1 line-clamp-1 text-left ">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map((item) => {
              return (
                <SelectItem value={item.value} key={item.value}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
