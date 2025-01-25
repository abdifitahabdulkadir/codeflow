"use client";

import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { signUpWithCrendentials } from "@/lib/actions/credentials.action";
import { SignUpSchema } from "@/lib/validations";
import { z } from "zod";
export default function SignUp() {
  return (
    <CredentialAuthForm<z.infer<typeof SignUpSchema>>
      schema={SignUpSchema}
      defaultValues={{
        email: "",
        password: "",
        username: "",
      }}
      formType="SIGN_UP"
      onSubmit={signUpWithCrendentials}
    />
  );
}
