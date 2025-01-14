import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface CustomAvatorProps {
  name: string;
  userId: string | undefined;
  userImage: string | undefined;
}

export default async function CustomAvator({
  userId,
  userImage,
  name,
}: CustomAvatorProps) {
  const alteredName = name
    ?.split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const content = (
    <Avatar>
      {userImage ? (
        <Image
          src={`${userImage}`}
          alt="profile avator"
          height={40}
          width={40}
          quality={100}
          className="object-cover"
        />
      ) : (
        <AvatarFallback>
          <div className="primary-gradient flex size-full items-center justify-center rounded-full font-space-grotesk font-bold tracking-wider !text-white">
            {alteredName}
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
  return userId ? (
    <Link href={ROUTES.PROFILE(userId!)}>{content}</Link>
  ) : (
    content
  );
}
