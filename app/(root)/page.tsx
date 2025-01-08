import Link from "next/link";

import QuesionCard from "@/components/cards/QuesionCard";
import HomeFilters from "@/components/Filters/HomeFilters";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getQuestions } from "@/lib/actions/action.question";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { query = "", page, pageSize, filter } = await searchParams;
  const { success, data, errors } = await getQuestions({
    query,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    sort: "",
    filter,
  });
  const { questions } = data!;
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
      {success ? (
        <div className="mt-10 flex w-full flex-col gap-3">
          {questions && questions.length > 0 ? (
            questions?.map((question: QuestionI) => (
              <QuesionCard key={String(question._id)} question={question} />
            ))
          ) : (
            <div className="mt-10 flex items-center justify-center">
              <p className="text-dark400_light700">Not Questions Found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center">
          <p className="text-dark400_light700">
            {errors?.message || "Failed to fetch data"}
          </p>
        </div>
      )}
    </>
  );
}
