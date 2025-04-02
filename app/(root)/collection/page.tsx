import { FadeInWithSlideAnimation } from "@/components/animations";
import QuesionCard from "@/components/cards/QuesionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/Filters/CommonFilter";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { CollectionFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSaveQuestions } from "@/lib/actions/collection.action";
import { CollectionI } from "@/types/action";
import { PageParams } from "@/types/glabal";

export default async function CollectionPage({ searchParams }: PageParams) {
  const { query = "", page, pageSize, filter } = await searchParams;
  const { success, data, errors } = await getSaveQuestions({
    query,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  return (
    <>
      <section className="flex  w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold  text-dark100_light900">All Saved Questions</h1>
      </section>
      <section className="mt-10 flex  justify-between flex-wrap w-full gap-3 ">
        <LocalSeachBar
          route={ROUTES.COLLECTION}
          imageSrc="/icons/search.svg"
          placeholder="Search quesions.."
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex"
        />
      </section>
      <div className="mt-10 flex w-full flex-col gap-3">
        <DataRenderer
          success={success}
          error={errors}
          data={data?.collection}
          stateType={EMPTY_QUESTION}
          render={(collections) => {
            return collections?.map((question: CollectionI) => (
              <FadeInWithSlideAnimation key={String(question._id)}>
                <QuesionCard
                  key={String(question._id)}
                  question={question.question}
                />
              </FadeInWithSlideAnimation>
            ));
          }}
        />
      </div>
    </>
  );
}
