import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";

export default  function LeftSidebar() {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <NavLinks isMobile />
      <div className="flex h-fit flex-col items-center gap-3">
        <Button className="btn-secondary small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
          <Link href={ROUTES.SIGN_IN} className="flex items-center gap-2">
            <Image
              src={"/icons/account.svg"}
              alt="accont logo"
              width={20}
              height={20}
              loading="eager"
              priority
              className="invert-colors md:hidden"
            />
            <span className="primary-text-gradient max-md:hidden">Log in</span>
          </Link>
        </Button>

        <Button className="btn-tertiary light-border-2 text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
          <Link href={ROUTES.SIGN_IN} className="flex items-center gap-2">
            <Image
              src={"/icons/sign-up.svg"}
              alt="accont logo"
              width={20}
              height={20}
              loading="eager"
              priority
              className="invert-colors md:hidden"
            />
            <span className="text-dark-400 dark:text-light-900 max-md:hidden">
              Sign Up
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
