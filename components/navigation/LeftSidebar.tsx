import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { LogOut } from "lucide-react";
import NavLinks from "./navbar/NavLinks";

export default async function LeftSidebar() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <section className=" bg-light-900 dark:bg-dark-200 border-light-800 dark:border-dark-300 custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <NavLinks isMobile userId={userId} />
      <div className="mt-4 flex h-fit flex-col items-center gap-3">
        {userId ? (
          <form
            className="flex w-full items-center gap-2"
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="base-medium w-fit bg-transparent! px-4 py-3 shadow-none"
            >
              <LogOut className="size-10 text-dark-100 dark:text-white" />
              <span className="!text-dark-300 dark:!text-light-900  max-sm:hidden">
                Logout
              </span>
            </Button>
          </form>
        ) : (
          <>
            <Button className="!bg-light-800 dark:!bg-dark-400 small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Link href={ROUTES.SIGN_IN} className="flex items-center gap-2">
                <Image
                  src={"/icons/account.svg"}
                  alt="accont logo"
                  width={20}
                  height={20}
                  loading="eager"
                  priority
                  className=" invert dark:invert-0  md:hidden"
                />
                <span className="primary-text-gradient max-md:hidden">
                  Log in
                </span>
              </Link>
            </Button>
            <Button className="!bg-light-700 dark:!bg-dark-300 border-light-800 dark:border-dark-300-2 !text-dark-400! dark:!text-light-900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
              <Link href={ROUTES.SIGN_UP} className="flex items-center gap-2">
                <Image
                  src={"/icons/sign-up.svg"}
                  alt="accont logo"
                  width={20}
                  height={20}
                  loading="eager"
                  priority
                  className=" invert dark:invert-0  md:hidden"
                />
                <span className="text-dark-400 dark:text-light-900 max-md:hidden">
                  Sign Up
                </span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
