"use client";
import CredentialAuthForm from "@/components/Forms/CredentialAuthForm";
import { SignInSchema } from "@/lib/validations";

export default function SignIn() {
  return (
    <CredentialAuthForm
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
