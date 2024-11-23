"use client";
import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { SignInSchema } from "@/lib/validations";
import { z } from "zod";
export default function SignIn() {
  return (
    <CredentialAuthForm<z.infer<typeof SignInSchema>>
      schema={SignInSchema}
      defaultValues={{
        password: "",
        email: "",
      }}
      formType="SIGN_IN"
      onSubmit={async (data) => {
        console.log(data);
        return { success: true };
      }}
    />
  );
}
