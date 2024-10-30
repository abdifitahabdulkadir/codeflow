"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function SignoutButton() {
  return (
    <Button
      onClick={async () => {
        await signOut({
          redirectTo: ROUTES.SIGN_IN,
        });
      }}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className="btn-secondary small-medium !text-dark400_light900 w-full rounded-lg px-4 py-3 text-center shadow-none"
    >
      {/* <Image
    src={"/images/logout-icon.svg"}
    alt="logout icon"
    width={20}
    height={20}
    loading="eager"
    priority
  /> */}
      Log out
    </Button>
  );
}
