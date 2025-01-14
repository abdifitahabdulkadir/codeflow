"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export default function NavLinks({
  isMobile = false,
  userId,
}: {
  isMobile?: boolean;
  userId: string | undefined;
}) {
  const pathName = usePathname();
  return (
    <>
      <div className="flex flex-col gap-y-4">
        {sidebarLinks.map(({ route, imgURL, label }) => {
          const isActive =
            (pathName.includes(route.toLowerCase()) && route.length > 1) ||
            pathName === route;
          const linkComponent = (
            <Link
              key={label}
              href={
                route === "/profile" ? ROUTES.PROFILE(userId || "1") : route
              }
              className={`flex items-center justify-start gap-3 rounded-lg p-2 ${
                isActive
                  ? "primary-gradient text-light-900"
                  : "text-dark300_light900 bg-transparent"
              } max-lg:w-fit lg:w-full`}
            >
              <Image
                src={imgURL}
                alt={route + " logo "}
                width={20}
                height={20}
                loading="eager"
                priority
                className={cn({
                  "invert-colors": !isActive,
                })}
              />
              <span
                className={cn(
                  isMobile && "max-md:hidden",
                  !isActive ? "text-dark300_light900" : "text-light-900",
                  "",
                )}
              >
                {label}
              </span>
            </Link>
          );

          return !isMobile ? (
            <SheetClose key={label} asChild>
              {linkComponent}
            </SheetClose>
          ) : (
            linkComponent
          );
        })}
      </div>
    </>
  );
}
