"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";

import { signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import NavLinks from "./NavLinks";

export default function MobileNavigation() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Image
          src={"/icons/hamburger.svg"}
          className=" invert dark:invert-0  sm:hidden"
          alt="menu"
          height={36}
          width={36}
        />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="background-light900_dark200 border-none"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/images/site-logo.svg"}
            width={23}
            height={23}
            alt="codeflow logo"
            loading="eager"
            priority
          />
          <p className="h2-bold font-space-grotesk text-dark200_light900">
            Code
            <span className="text-primary-400">Flow</span>
          </p>
        </Link>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks userId={userId} />
            </section>
          </SheetClose>
          <div className="flex flex-col gap-3">
            {userId ? (
              <SheetClose asChild>
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await signOut();
                  }}
                >
                  <Button
                    type="submit"
                    className="base-medium w-fit bg-transparent! px-4 py-3 shadow-none"
                  >
                    <LogOut className="size-10 text-dark-100 dark:text-white" />
                    <span className="text-dark300_light900  max-sm:hidden">
                      Logout
                    </span>
                  </Button>
                </form>
              </SheetClose>
            ) : (
              <>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button className="background-light800_dark400  small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                      <span className="primary-text-gradient">Log in</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_UP}>
                    <Button className="background-light700_dark300 light-border text-dark400_light900  min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
