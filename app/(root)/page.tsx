import Link from "next/link";

import QuesionCard from "@/components/cards/QuesionCard";
import HomeFilters from "@/components/Filters/HomeFilters";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { Button } from "@/components/ui/button";
import { questions } from "@/constants/quesions";
import { ROUTES } from "@/constants/routes";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
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

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-3">
        {filterdQuestions.map((question) => (
          <QuesionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}
