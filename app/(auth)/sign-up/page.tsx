"use client";

import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { SignUpSchema } from "@/lib/validations";

export default function SignUp() {
  return (
    <CredentialAuthForm
      schema={SignUpSchema}
      defaultValues={{
        password: "",
        email: "",
        username: "",
      }}
      formType="SIGN_UP"
      onSubmit={async (data) => {
        console.log(data);
        return { success: true };
      }}
    />
  );
}
