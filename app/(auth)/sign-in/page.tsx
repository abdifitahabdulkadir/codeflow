"use client";
import { AuthFrom } from "@/components/Forms/AuthForm";

export default function SignIn() {
  return (
    <AuthFrom
      formType="SIGN_IN"
      onSubmit={() => new Promise((resolve) => resolve({ success: true }))}
      defualtValues={{ email: "", password: "" }}
    />
  );
}
