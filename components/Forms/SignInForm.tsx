"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SignInSchema } from "@/lib/validations";

import { z } from "zod";
import { Input } from "../ui/input";
import { FormFieldItem, FormLabel, FromErrorElement } from "./FormElements";

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleOnSubmit = () => {
    // TODO:ATUTHENTICATE USER
  };
  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="mt-6 space-y-5">
      {/* email */}

      <FormFieldItem>
        <FormLabel>Email Address</FormLabel>
        <Input
          type={"text"}
          {...register("email")}
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
        />
        {errors?.email && (
          <FromErrorElement>{errors?.email?.message}</FromErrorElement>
        )}
      </FormFieldItem>

      {/* passowrd */}
      <FormFieldItem>
        <FormLabel>Password</FormLabel>
        <Input
          type={"password"}
          {...register("password")}
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
        />
        {errors?.password && (
          <FromErrorElement>{errors?.password?.message}</FromErrorElement>
        )}
      </FormFieldItem>

      <Link
        href={ROUTES.HOME}
        className="flex w-full justify-end text-sm text-sky-400 transition-all duration-150 hover:underline"
      >
        Forgot Password?
      </Link>

      <Button
        disabled={isSubmitting}
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 text-center !text-light-900"
      >
        {isSubmitting ? "Sign In ..." : "Sign In"}
      </Button>
      <p className="text-dark300_light700 body-regular flex w-full items-center justify-center text-sm">
        Don&rsquo;t have an account?
        <Link
          className="body-medium ms-3 text-primary-400"
          href={`${ROUTES.SIGN_UP}`}
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
