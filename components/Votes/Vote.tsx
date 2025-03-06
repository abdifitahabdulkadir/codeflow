"use client";

import { toast } from "@/hooks/use-toast";
import { cn, formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTransition } from "react";

interface Props {
  upVotes: number;
  downVotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}
export default function Vote({
  upVotes,
  downVotes,
  hasDownVoted,
  hasUpVoted,
}: Props) {
  const [isVoting, startTranstion] = useTransition();
  const session = useSession();

  function handleVotes(Vote: "upvote" | "downVote") {
    const userId = session?.data?.user?.id;
    if (!userId)
      toast({
        title: "Voting Rejected",
        description: "Only logged in users can vote.",
        variant: "destructive",
      });

    try {
    } catch {
      toast({
        title: "Failed to process the Vote",
        description:
          "Failed while processing the vote, please try again later.",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="voting icons"
          width={18}
          height={18}
          aria-label="upvote"
          className={cn(" cursor-pointer", isVoting && "opacity-50")}
          onClick={() => handleVotes("upvote")}
        />
        <div className="background-light700_dark400 flex-center min-w-5 rounded-sm p-1">
          <p className="subtle-medium text400_light900">
            {formatNumber(upVotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownVoted ? "/icons/downavoted.svg" : "/icons/downvote.svg"}
          alt="voting icons"
          width={18}
          height={18}
          aria-label="donwvote"
          className={cn(" cursor-pointer", isVoting && "opacity-50")}
          onClick={() => handleVotes("upvote")}
        />
        <div className="background-light700_dark400 flex-center min-w-5 rounded-sm p-1">
          <p className="subtle-medium text400_light900">
            {formatNumber(downVotes)}
          </p>
        </div>
      </div>
    </div>
  );
}
