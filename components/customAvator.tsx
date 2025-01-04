import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default async function CustomAvator() {
  const session = await auth();
  const name = session?.user?.name
    ?.split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  const userId = session?.user?.id;
  const userImage = session?.user?.image;
  return (
    <Link href={ROUTES.PROFILE(userId!)}>
      <Avatar>
        {userImage ? (
          <Image
            src={userImage}
            alt="profile avator"
            height={40}
            width={40}
            quality={100}
            className="object-cover"
          />
        ) : (
          <AvatarFallback>
            <div className="primary-gradient flex size-full items-center justify-center rounded-full font-space-grotesk font-bold tracking-wider !text-white">
              {name}
            </div>
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
