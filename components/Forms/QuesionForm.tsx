"use client";

import dynamic from "next/dynamic";

import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AnimatePresence, motion } from "framer-motion";
import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormFieldItem,
  FormLabel,
  FromDescription,
  FromErrorElement,
} from "./FormElements";
// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

export default function QuesionForm() {
  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string[],
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (field.length >= 3) {
        setError("tags", {
          type: "manual",
          message: "You can only add upto 3 tags",
        });
      } else if (
        tagInput &&
        tagInput.length < 15 &&
        !field.includes(tagInput)
      ) {
        setValue("tags", [...field, tagInput]);
        e.currentTarget.value = "";
        clearErrors("tags");
      } else if (tagInput.length > 15) {
        setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.includes(tagInput)) {
        setError(
          "tags",
          {
            type: "manual",
            message: "Tag already exists",
          },
          { shouldFocus: true },
        );
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = getValues("tags").filter((tag) => tag !== tagToRemove);
    setValue("tags", newTags, { shouldValidate: true, shouldDirty: true });
  };

  const handleAskQuesion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log("data ", data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleAskQuesion)}
      className="flex w-full flex-col gap-10"
    >
      {/* title */}
      <FormFieldItem>
        <FormLabel>
          Question Title
          <span className="text-primary-400">*</span>
        </FormLabel>
        <Input
          {...register("title")}
          type="text"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
        />
        {errors?.title && (
          <FromErrorElement>{errors.title.message}</FromErrorElement>
        )}
      </FormFieldItem>

      {/* content input field */}
      <FormFieldItem>
        <FormLabel>
          Describe your problem
          <span className="text-primary-400">*</span>
        </FormLabel>
        <Editor
          value={getValues("content")}
          fieldChange={(value: string) => {
            if (value.length > 1) {
              clearErrors("content");
            }
            setValue("content", value);
          }}
          editorRef={editorRef}
        />
        <FromDescription>
          Introduce your problem and expand what you have put in the title. be
          specific and clear.
        </FromDescription>
        {errors?.content && (
          <FromErrorElement>{errors.content.message}</FromErrorElement>
        )}
      </FormFieldItem>

      {/* tags */}
      <FormFieldItem>
        <FormLabel>
          Tags
          <span className="text-primary-400">*</span>
        </FormLabel>
        <Input
          onKeyDown={(e) => handleInputKeyDown(e, getValues("tags"))}
          type="text"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
        />
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {getValues("tags").map((eachTag, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{ duration: 0.4 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: index % 2 === 0 ? 10 : -10,
                  }}
                >
                  <TagCard
                    isButton
                    _id={eachTag}
                    name={eachTag}
                    hasRemoveIcon
                    onClick={() => removeTag(eachTag)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <FromDescription>
          Add upto 3 tags to descripe what your problem is about. you need to
          hit Enter to add tag.
        </FromDescription>
        {errors.tags && (
          <FromErrorElement>{errors.tags.message}</FromErrorElement>
        )}
      </FormFieldItem>

      <div className="flex w-full items-center justify-end">
        <Button type="submit" className="primary-gradient !text-light-900">
          Ask Quesion
        </Button>
      </div>
    </form>
  );
}