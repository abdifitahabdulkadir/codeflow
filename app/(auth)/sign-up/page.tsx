"use client";
import { AuthFrom } from "@/components/Forms/AuthForm";

export default function SignUp() {
  return (
    <AuthFrom
      formType="SIGN_UP"
      onSubmit={(values) => console.log(values)}
      defualtValues={{ username: "", email: "", password: "" }}
    />
  );
}
