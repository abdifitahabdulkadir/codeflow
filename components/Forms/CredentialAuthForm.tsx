import { ROUTES } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormFieldItem, FormLabel, FromErrorElement } from "./FormElements";

interface CredentialAuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: "SIGN_UP" | "SIGN_IN";
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

export default function CredentialAuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: CredentialAuthFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const handleOnFormSubmit: SubmitHandler<T> = async () => {
    // TODO:ATUTHENTICATE USER
    if (formType === "SIGN_UP") {
      await onSubmit(defaultValues);
      //   onSubmit(defaultValues)
      console.log(defaultValues);
    } else if (formType === "SIGN_IN") {
      console.log(defaultValues);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleOnFormSubmit)}
      className="mt-6 space-y-5"
    >
      {Object.keys(defaultValues).map((item, index) => {
        const formatItem =
          item.slice(0, 1).toUpperCase() + item.slice(1).toLocaleLowerCase();
        return (
          <FormFieldItem key={index}>
            <FormLabel>{formatItem}</FormLabel>
            <Input
              type={"text"}
              {...register(item as Path<T>)}
              className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
            />
            {errors[item] && (
              <FromErrorElement>
                {errors[item]?.message?.toString()}
              </FromErrorElement>
            )}
          </FormFieldItem>
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
        disabled={isSubmitting}
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 text-center !text-light-900"
      >
        {isSubmitting
          ? formType === "SIGN_IN"
            ? "Signining in...."
            : "Signing up...."
          : formType === "SIGN_IN"
            ? "Sign In"
            : "Sign up"}
      </Button>
      <p className="text-dark300_light700 body-regular flex w-full items-center justify-center text-sm">
        {formType === "SIGN_UP"
          ? "Already have an account?"
          : "Don't have an account?"}

        <Link
          className="body-medium ms-3 font-bold text-primary-400"
          href={`${formType === "SIGN_IN" ? ROUTES.SIGN_UP : ROUTES.SIGN_IN}`}
        >
          {formType === "SIGN_IN" ? "SIGN UP" : "SIGN IN"}
        </Link>
      </p>
    </form>
  );
}
