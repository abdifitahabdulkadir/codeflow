"use client";

import { toast } from "@/hooks/use-toast";
import { toggleSaveToCollection } from "@/lib/actions/collection.action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTransition } from "react";
interface Props {
  questionId: string;
}
export default function SaveQuestion({ questionId }: Props) {
  const [isSaving, startTranstion] = useTransition();
  const user = useSession();
  function handleSaveQuestion() {
    if (!user.data?.user?.id)
      return toast({
        title: "Only logged in users can save question",
        variant: "destructive",
      });

    startTranstion(async () => {
      if (isSaving) return;
      try {
        const { success, data, errors } = await toggleSaveToCollection({
          questionId,
        });
        console.log(data);
        if (!success) throw new Error(errors?.message);
        toast({
          title: `Question ${data?.saved ? "Saved" : "UnSaved"} Succesffully `,
        });
      } catch (error) {
        toast({
          title: "Failed to Save Quetion",
          description:
            error instanceof Error
              ? error.message
              : "Failed to save question try again!",
        });
      }
    });
  }
  return (
    <Image
      src={"/icons/star-filled.svg"}
      width={18}
      height={18}
      alt="save image"
      className={cn(
        "ms-1.5",
        isSaving && "animate-spin duration-300 opacity-80",
      )}
      aria-label="save question"
      onClick={handleSaveQuestion}
    />
  );
}
