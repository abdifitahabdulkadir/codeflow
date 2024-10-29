"use client";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ isMobile = false }: { isMobile?: boolean }) {
  const pathName = usePathname();
  return (
    <>
      <div className="flex flex-col gap-y-4">
        {sidebarLinks.map(({ route, imgURL, label }) => {
          const isActive = pathName === route;
          const linkComponent = (
            <Link
              key={label}
              href={route}
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
                  !isActive
                    ? "base-medium dtext-dark300_light900"
                    : "base-bold text-light-900",
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
