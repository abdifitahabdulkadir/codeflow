"use client";

import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { signUpWithCrendentials } from "@/lib/actions/action.signup";
import { SignUpSchema } from "@/lib/validations";
import { z } from "zod";
export default function SignUp() {
  return (
    <CredentialAuthForm<z.infer<typeof SignUpSchema>>
      schema={SignUpSchema}
      defaultValues={{
        password: "",
        email: "",
        username: "",
      }}
      formType="SIGN_UP"
      onSubmit={signUpWithCrendentials}
    />
  );
}
