import Image from "next/image";
import Link from "next/link";

import CustomAvator from "@/components/customAvator";
import MobileNavigation from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src={"/images/site-logo.svg"}
          width={23}
          height={23}
          alt="codeflow logo"
          loading="eager"
          priority
        />
        <p className="h2-bold font-space-grotesk text-dark-200 dark:text-light-900">
          Code
          <span className="text-primary-400">Flow</span>
        </p>
      </Link>
      <p className="w-fit px-10 max-lg:hidden">GloablSerach</p>
      <div className="flex-between items-center gap-5">
        <ThemeToggle />
        <CustomAvator />

        <MobileNavigation />
      </div>
    </nav>
  );
}
