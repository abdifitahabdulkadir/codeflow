import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import TagCard from "./cards/TagCard";

const hotQuesions = [
  {
    id: "1",
    title: "How to create a custom hook in React?",
  },
  {
    id: "2",
    title: "How to create a custom hook in React?",
  },
  {
    id: "3",
    title: "How to create a custom hook in React?",
  },
  {
    id: "4",
    title: "How to create a custom hook in React?",
  },
  {
    id: "5",
    title: "How to create a custom hook in React?",
  },
];
const tags = [
  {
    _id: "1",
    name: "React",
    quesionCount: 10,
  },
  {
    _id: "2",
    name: "Nextjs",
    quesionCount: 10,
  },
  {
    _id: "3",
    name: "TypeScript",
    quesionCount: 10,
  },
  {
    _id: "4",
    name: "JavaScript",
    quesionCount: 10,
  },
];
export default function RightSidebar() {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Hot Quesions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuesions.map(({ id, title }) => (
            <Link
              key={id}
              href={ROUTES.QUESION(id)}
              className="group flex cursor-pointer items-center justify-between gap-3"
            >
              <p className="body-medium group-hover:text-dark400_light800 text-dark500_light700 transition-all duration-200 group-hover:italic">
                {title}
              </p>
              <Image
                src={"/icons/chevron-right.svg"}
                alt="chevron icon"
                width={20}
                height={20}
                loading="eager"
                className="invert-colors transition-all duration-200 group-hover:scale-[1.4]"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light800">Popular Tags</h3>
        <div className="mt-7 flex flex-col flex-wrap gap-4">
          {tags.map(({ _id, name, quesionCount }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              quesionsCount={quesionCount}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}