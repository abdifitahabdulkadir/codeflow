import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import CustomAvator from "@/components/customAvator";
import MobileNavigation from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between  background-light900_dark200  fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
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
      <p className="w-fit px-10 max-lg:hidden">GloablSerach</p>
      <div className="flex  justify-between items-center gap-5">
        <ThemeToggle />
        <CustomAvator
          userId={session?.user?.id}
          userImage={session?.user?.image ?? undefined}
          name={session?.user?.name ?? ""}
        />

        <MobileNavigation />
      </div>
    </nav>
  );
}
