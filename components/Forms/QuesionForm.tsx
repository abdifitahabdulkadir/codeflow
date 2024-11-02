"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AskQuestionSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function QuesionForm() {
    const form=useForm({
        resolver:zodResolver(AskQuestionSchema),
        defaultValues:{
            title:"",
            content:""  ,
            tags:[]
        }
    })

    const handleAskQuesion=()=>{

    }
  return (
    <Form {...form} >
       <form onSubmit={form.handleSubmit(handleAskQuesion)} className="flex w-full flex-col gap-10">
       <FormField
            control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Title <span className="text-primary-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                    {...field}
                     type="text"
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Be specific and Imagine Your are asking question to another person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* content input fiedl */}
            <FormField
            control={form.control}
              name={"content"}
              render={() => (
                <FormItem>
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                 Detailed Explaination of your problem <span className="text-primary-400">*</span>
                  </FormLabel>
                  <FormControl>
                   <div>
                    edtor
                   </div>
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                   Introduce your problem and expand what you have put in the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* tags */}
            <FormField
            control={form.control}
              name={"tags"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-3">
                    <Input
                    {...field}
                     type="text"
                     placeholder="Tags..."
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                    />
                    <div className="mt-2 flex items-center gap-3">
                      tags
                    </div>
                    </div>
                   
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add upto 3 tags to descripe what your problem is about. you need to hit Enter to add tag.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="flex w-full items-center justify-end">
            <Button type="submit" className="primary-gradient !text-light-900">Ask Quesion</Button>
          </div>
       </form>
    </Form>
  )
}
