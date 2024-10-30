"use client";

import { signIn } from "next-auth/react";

import Image from "next/image";

import { toast } from "@/hooks/use-toast";

import { Button } from "../ui/button";

const buttonClass =
  "text-dark200_light800 background-dark400_light900 body-meduium min-h-12 flex-1 rounded-2 px-4 py-3.5 text-dark200_light800 background-dark400_light900 body-meduium min-h-12  transition-colors duration-300 hover:opacity-80    flex-1 rounded-2 px-4 py-3.5";

export default function SocailAuthForm() {
  // hanlde form submit
  const handleAuth = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        redirect: false,
        redirectTo: "/",
      });
    } catch (error) {
      toast({
        title: "SignIn Failed!",
        variant: "destructive",
        description:
          error instanceof Error
            ? "Faild to sign In with " + provider
            : "An error occured while authenticating with " + provider,
      });
    }
  };
  return (
    <div className=" mt-10 flex flex-wrap items-start gap-2.5">
      <Button className={buttonClass} onClick={() => handleAuth("github")}>
        <Image
          src={"/icons/github.svg"}
          alt="github logo"
          loading="eager"
          height={30}
          width={30}
          priority
          className="invert-colors object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleAuth("google")}>
        <Image
          src={"/icons/google.svg"}
          alt="github logo"
          loading="eager"
          height={30}
          width={30}
          priority
          className="object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
}
