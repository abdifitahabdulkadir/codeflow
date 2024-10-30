"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { SignInSchema, SignUpSchema } from "@/lib/validations";

interface AuthFromPropsType<T extends FieldValues> {
  formType: "SIGN_IN" | "SIGN_UP";
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  defualtValues: T;
}

export function AuthFrom<T extends FieldValues>({
  formType,
  defualtValues,
}: AuthFromPropsType<T>) {
  const formSchema = formType === "SIGN_IN" ? SignInSchema : SignUpSchema;
  const form = useForm<typeof formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defualtValues as DefaultValues<T>,
  });
  const handleOnSubmit = () => {
    // TODO:ATUTHENTICATE USER
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="mt-6 space-y-5"
      >
        {Object.keys(defualtValues).map((item) => {
          return (
            <FormField
              key={item}
              control={form.control}
              name={item}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="paragraph-medium text-dark400_light700">
                    {item === "email"
                      ? "Email Addres"
                      : item.substring(0, 1).toUpperCase() + item.substring(1)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={item === "password" ? "password" : "text"}
                      {...field}
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        {formType === "SIGN_IN" && (
          <Link
            href={ROUTES.HOME}
            className="flex w-full justify-end text-sm text-sky-400 transition-all duration-150 hover:underline"
          >
            Forgot Password?
          </Link>
        )}

        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 text-center !text-light-900"
        >
          {form.formState.isSubmitting
            ? formType === "SIGN_IN"
              ? "Sign In ..."
              : "Sign Up..."
            : formType === "SIGN_IN"
              ? "Sign In"
              : "Sign Up"}
        </Button>
        <p className="text-dark300_light700 body-regular flex w-full items-center justify-center text-sm">
          {formType === "SIGN_UP"
            ? "Already have an account?"
            : "Don't have an account?"}
          <Link
            className="body-medium ms-3 text-primary-400"
            href={`${formType === "SIGN_IN" ? ROUTES.SIGN_UP : ROUTES.SIGN_IN}`}
          >
            {formType === "SIGN_IN" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </Form>
  );
}
