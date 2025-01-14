import QuesionCard from "@/components/cards/QuesionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { ROUTES } from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tags.action";
import { RouteParams } from "@/types/glabal";

export default async function TagPage({ searchParams, params }: RouteParams) {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { data, errors, success } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });
  const { questions, tag } = data || {};
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>

      <section className="mt-10">
        <LocalSeachBar
          route={ROUTES.TAG(tag?._id)}
          imageSrc="/icons/search.svg"
          placeholder="Search quesions.."
        />
      </section>
      <div className="mt-10 flex w-full flex-col gap-3">
        <DataRenderer
          success={success}
          error={errors}
          data={questions}
          stateType={EMPTY_QUESTION}
          render={(questions) => {
            return questions?.map((question: QuestionI) => (
              <QuesionCard key={String(question._id)} question={question} />
            ));
          }}
        />
      </div>
    </>
  );
}
