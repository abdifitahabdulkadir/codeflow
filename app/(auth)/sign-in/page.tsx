"use client";
import { AuthFrom } from "@/components/Forms/AuthForm";

export default function SignIn() {
  return (
    <AuthFrom
      formType="SIGN_IN"
      onSubmit={(values) => console.log(values)}
      defualtValues={{ email: "", password: "" }}
    />
  );
}
