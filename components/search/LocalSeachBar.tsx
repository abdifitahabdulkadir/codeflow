"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { removeUrlQueryParams, updateUrlQueryParams } from "@/lib/url";

import { Input } from "../ui/input";

interface LocalSeachBarProps {
  imageSrc: string;
  placeholder: string;
  otherClasses?: string;
  route: string;
}

export default function LocalSeachBar({
  imageSrc,
  placeholder,
  otherClasses,
  route,
}: LocalSeachBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const queryString = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(queryString);
  useEffect(
    function () {
      const debounceDelayFn = setTimeout(() => {
        if (searchQuery) {
          const newUrl = updateUrlQueryParams({
            key: "query",
            value: searchQuery,
          });
          router.push(newUrl, { scroll: false });
        } else if (pathName === route) {
          const newUrl = removeUrlQueryParams({
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }, 400);
      return () => clearTimeout(debounceDelayFn);
    },

    [searchQuery, route, pathName, router, searchParams],
  );

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <label htmlFor="search">
        <Image
          src={imageSrc}
          width={24}
          height={24}
          alt="search icon"
          className="invert-colors cursor-pointer"
        />
      </label>

      <Input
        id="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="no-focus paragraph-regular text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />
    </div>
  );
}
