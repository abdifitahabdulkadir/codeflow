import { auth } from "@/auth";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
const questions = [
  {
    id: 1,
    title: "How to create a new project in react",
    tags: ["react", "javascript", "web"],
    answers: 10,
    views: 100,
    askedBy: "John Doe",
  },
  {
    id: 2,
    title: "How to use useState in React",
    tags: ["react", "hooks", "state"],
    answers: 5,
    views: 200,
    askedBy: "Jane Smith",
  },
  {
    id: 3,
    title: "Understanding closures in JavaScript",
    tags: ["javascript", "closures", "functions"],
    answers: 8,
    views: 150,
    askedBy: "Alice Johnson",
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox",
    tags: ["css", "grid", "flexbox"],
    answers: 12,
    views: 300,
    askedBy: "Bob Brown",
  },
  {
    id: 5,
    title: "Setting up a Node.js server",
    tags: ["nodejs", "server", "backend"],
    answers: 7,
    views: 250,
    askedBy: "Charlie Davis",
  },
  {
    id: 6,
    title: "Introduction to TypeScript",
    tags: ["typescript", "javascript", "types"],
    answers: 9,
    views: 180,
    askedBy: "Dana White",
  },
  {
    id: 7,
    title: "Building REST APIs with Express",
    tags: ["express", "nodejs", "api"],
    answers: 11,
    views: 220,
    askedBy: "Eve Black",
  },
];

interface HomeProps {
  searchParams: Promise<{ [key: string]: string }>;
}
export default async function Home({ searchParams }: HomeProps) {
  const session = await auth();
  const { query = "" } = await searchParams;
  const filterdQuestions = questions.filter((question) => {
    return question.title.toLowerCase().includes(query.toLocaleLowerCase());
  });
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Quesions</h1>
        <Button
          className="primary-gradient min-h-[46px] w-fit self-end px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUEISION}>Ask a question</Link>
        </Button>
      </section>

      <section className="mt-10">
        <LocalSeachBar
          route="/"
          imageSrc="/icons/search.svg"
          placeholder="Search quesions.."
        />
      </section>

      <div>home filters</div>
      <div className="mt-10 flex w-full flex-col gap-3">
        {filterdQuestions.map((question) => (
          <h2 key={question.id}>{question.title}</h2>
        ))}
      </div>
    </>
  );
}
