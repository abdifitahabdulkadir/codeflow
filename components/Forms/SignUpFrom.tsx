"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SignUpSchema } from "@/lib/validations";

import { z } from "zod";
import { Input } from "../ui/input";
import { FormFieldItem, FormLabel, FromErrorElement } from "./FormElements";
export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });
  const handleOnSubmit = () => {
    // TODO:ATUTHENTICATE USER
  };
  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="mt-6 space-y-5">
      {/* username */}
      <FormFieldItem>
        <FormLabel>Username</FormLabel>
        <Input
          type={"text"}
          {...register("username")}
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
        />
        {errors?.username && (
          <FromErrorElement>{errors?.username?.message}</FromErrorElement>
        )}
      </FormFieldItem>

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
          {...register("username")}
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
        />
        {errors?.password && (
          <FromErrorElement>{errors?.password?.message}</FromErrorElement>
        )}
      </FormFieldItem>

      <Button
        disabled={isSubmitting}
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 text-center !text-light-900"
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
      <p className="text-dark300_light700 body-regular flex w-full items-center justify-center text-sm">
        Already have an account?
        <Link
          className="body-medium ms-3 text-primary-400"
          href={`${ROUTES.SIGN_IN}`}
        >
          Sig In
        </Link>
      </p>
    </form>
  );
}
