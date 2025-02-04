"use client";

import { toast } from "@/hooks/use-toast";
import { incrementViews } from "@/lib/actions/action.question";
import { useEffect } from "react";

export default function View({ questionId }: { questionId: string }) {
  async function hanldeIncrmenet() {
    const result = await incrementViews({ questionId: questionId });

    if (result) {
      toast({
        title: "Success",
        description: "Views incremented",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to incremnet the views",
        variant: "destructive",
      });
    }
  }
  useEffect(function () {
    hanldeIncrmenet();
  }, []);
  return null;
}
