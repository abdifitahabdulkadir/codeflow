"use client";
import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { signInWithCredentials } from "@/lib/actions/credentials.action";
import { SignInSchema } from "@/lib/validations";
import { z } from "zod";
export default function SignIn() {
  return (
    <CredentialAuthForm<z.infer<typeof SignInSchema>>
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      formType="SIGN_IN"
      onSubmit={signInWithCredentials}
    />
  );
}
