"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function ThemeToggle() {
  const { setTheme, resolvedTheme: currentTheme } = useTheme();
  console.log(currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className="cursor-pointer outline-none focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200"
        >
          {currentTheme === "light" && (
            <Image
              src={"/icons/sun.svg"}
              width={30}
              height={30}
              alt="light mode logo"
              priority
              loading="eager"
              className="active-theme"
            />
          )}
          {currentTheme === "dark" && (
            <Image
              src={"/icons/moon.svg"}
              width={30}
              height={30}
              alt="dark mode logo"
              priority
              loading="eager"
              className="active-theme"
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Image
            src={"/icons/sun.svg"}
            width={20}
            height={20}
            alt="light mode logo"
            priority
            loading="eager"
            className="invert-colors"
          />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Image
            src={"icons/moon.svg"}
            width={20}
            height={20}
            alt="light mode logo"
            priority
            loading="eager"
          />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Image
            src={"/icons/computer.svg"}
            width={20}
            height={20}
            alt="light mode logo"
            priority
            loading="eager"
          />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
