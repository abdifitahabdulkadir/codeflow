"use client";

import { toast } from "@/hooks/use-toast";
import { createVoteCount } from "@/lib/actions/vote.actions";
import { cn, formatNumber } from "@/lib/utils";
import { HasVotedResponse } from "@/types/action";
import { ActionResponse } from "@/types/glabal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useTransition } from "react";

interface Props {
  upVotes: number;
  downVotes: number;
  votePromise: Promise<ActionResponse<HasVotedResponse>>;
  targetId: string;
  targetType: "question" | "answer";
}
export default function Vote({
  upVotes,
  targetId,
  targetType,
  votePromise,
  downVotes,
}: Props) {
  const [isVoting, startTranstion] = useTransition();
  const session = useSession();

  const { success, data } = use(votePromise);
  const { hasDownVoted, hasUpvoted } = data ?? {};

  // creating the vote
  function handleVotes(vote: "upvote" | "downvote") {
    const userId = session?.data?.user?.id;
    if (!userId)
      toast({
        title: "Voting Rejected",
        description: "Only logged in users can vote.",
        variant: "destructive",
      });
    startTranstion(async () => {
      try {
        const result = await createVoteCount({
          targetId,
          targetType,
          voteType: vote,
        });
        if (result.success) {
          toast({
            title: "Voted Succesfully",
            description:
              vote == "downvote"
                ? "Vote removed successfully"
                : "Vote Added Successfully",
          });
          return;
        }
        toast({
          title: "Vote update Failed",
          description: result.errors?.message,
          variant: "destructive",
        });
      } catch {
        toast({
          title: "Failed to process the Vote",
          description:
            "Failed while processing the vote, please try again later.",
          variant: "destructive",
        });
      }
    });
  }
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
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
          src={hasDownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="voting icons"
          width={18}
          height={18}
          aria-label="donwvote"
          className={cn(" cursor-pointer", isVoting && "opacity-50")}
          onClick={() => handleVotes("downvote")}
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
