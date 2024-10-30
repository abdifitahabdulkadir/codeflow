import { icons } from "@/constants/techmap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevCLass(techName: string) {
  return `${icons[techName.toLowerCase()]} colored ` || "devicon-default-plain";
}
