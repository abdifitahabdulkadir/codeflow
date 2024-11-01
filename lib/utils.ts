import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { icons } from "@/constants/techmap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevCLass(techName: string) {
  return `${icons[techName.toLowerCase()]} colored ` || "devicon-default-plain";
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  if (seconds < 5) return "just now";

  return `${Math.floor(seconds)} seconds ago`;
}
