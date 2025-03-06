"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.actions";
import { AnswerFormSchema } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ContentEditor from "../Editor/Editor";
import { Button } from "../ui/button";
import { FormFieldItem, FromErrorElement } from "./FormElements";

interface Props {
  questionId: string;
  question: string;
  content: string;
}
export default function AnswerForm({ questionId, content, question }: Props) {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      content: "",
    },
  });
  const [isDone, setIsDone] = useState(false);
  const [isPosting, startPostingTranstion] = useTransition();
  const [isAIGenerating, setIsAIGenerating] = useState();
  const handleOnFormSubmit = async (data: z.infer<typeof AnswerFormSchema>) => {
    startPostingTranstion(async () => {
      const result = await createAnswer({
        content: data.content,
        questionId,
      });
      if (result.success) {
        toast({
          title: "Success",
          description: "Answer has been posted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.errors?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <div className="flex w-full flex-col gap-2 sm:flex-row justify-between sm:items-center">
        <p className="paragraph-semibold text-dark400_light500">
          Put your Answer contnet down in the form
        </p>
        <Button
          type="submit"
          className="btn light-border-2 gap-1.5 border rounded-md px-4 py-2.5 text-400 dark:text-400 "
        >
          {isAIGenerating ? (
            <>
              <ReloadIcon className="animate-spin  mr-2 size-4" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src={"/icons/stars.svg"}
                alt="generate ai image icon"
                width={20}
                height={20}
                className="object-cover mr-2"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        className="mt-6 space-y-5 flex  flex-col w-full "
      >
        <FormFieldItem>
          <ContentEditor
            isSubmitting={isPosting}
            content={getValues("content")}
            onChangeHandle={(e) => setValue("content", e)}
          />

          {errors.content && (
            <FromErrorElement>
              {errors.content?.message?.toString()}
            </FromErrorElement>
          )}
        </FormFieldItem>

        <Button className="self-end  !primary-gradient py-3 px-3 !text-light-800 rounded">
          {isPosting ? "Posting..." : "Post Answer"}
        </Button>
      </form>
    </div>
  );
}
