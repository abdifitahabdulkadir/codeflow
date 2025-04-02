import { ROUTES } from "@/constants/routes";
import { UserParams } from "@/types/action";
import Link from "next/link";
import CustomAvator from "../customAvator";

interface Props {
  user: UserParams;
}

export default function UserCard({
  user: { image, name, _id, username },
}: Props) {
  return (
    <div className="shadow-light-100 dark:shadow-none w-full xs:w-[230px] mt-10 ">
      <article className="background-light900_dark200 light-border flex w-full items-center justify-center  rounded-2xl border p-4 flex-col">
        <CustomAvator userId={_id} name={name} userImage={image} />
        <Link href={ROUTES.PROFILE(_id)}>
          <div className="mt-4 text-center">
            <h4 className="line-clamp-1 h3-bold text-dark200_light900">
              {name}
            </h4>
            <p className="line-clamp-1 body-regular text-dark500_light500 mt-2">
              @{username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
}
