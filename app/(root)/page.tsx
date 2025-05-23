import Link from "next/link";

import { FadeInWithSlideAnimation } from "@/components/animations";
import QuesionCard from "@/components/cards/QuesionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/Filters/CommonFilter";
import HomeFilters from "@/components/Filters/HomeFilters";
import Pagination from "@/components/Pagination";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import { QuestionI } from "@/types/action";
import { PageParams } from "@/types/glabal";

export default async function Home({ searchParams }: PageParams) {
  const { query = "", page, pageSize, filter } = await searchParams;
  const { success, data, errors } = await getQuestions({
    query,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });
  return (
    <>
      <section className="flex  w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold  text-dark100_light900">All Quesions</h1>
        <Button
          className="primary-gradient rounded  min-h-[46px] w-fit self-end px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASK_QUEISION}>Ask a question</Link>
        </Button>
      </section>
      <section className="mt-10 flex justify-between  flex-wrap gap-3 ">
        <LocalSeachBar
          route="/"
          imageSrc="/icons/search.svg"
          placeholder="Search quesions.."
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] w-full"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-3">
        <DataRenderer
          success={success}
          error={errors}
          data={data?.questions}
          stateType={EMPTY_QUESTION}
          render={(questions) => {
            return questions?.map((question: QuestionI) => (
              <FadeInWithSlideAnimation key={String(question._id)}>
                <QuesionCard key={String(question._id)} question={question} />
              </FadeInWithSlideAnimation>
            ));
          }}
        />

        <Pagination page={page || 1} isNext={data?.isNext || false} />
      </div>
    </>
  );
}
