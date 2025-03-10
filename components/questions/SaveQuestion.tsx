"use client";

import { toast } from "@/hooks/use-toast";
import { toggleSaveToCollection } from "@/lib/actions/collection.action";
import { cn } from "@/lib/utils";
import { ActionResponse } from "@/types/glabal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useTransition } from "react";
interface Props {
  questionId: string;
  hasSavePromise: Promise<ActionResponse<{ saved: boolean }>>;
}
export default function SaveQuestion({ questionId, hasSavePromise }: Props) {
  const [isSaving, startTranstion] = useTransition();
  const { data } = use(hasSavePromise);

  const image = data?.saved ? "/icons/star-filled.svg" : "/icons/star-red.svg";

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
      src={image}
      width={18}
      height={18}
      alt="save image"
      className={cn(
        "ms-1.5 object-cover cursor-pointer",
        isSaving && " opacity-80",
      )}
      aria-label="save question"
      onClick={handleSaveQuestion}
    />
  );
}
