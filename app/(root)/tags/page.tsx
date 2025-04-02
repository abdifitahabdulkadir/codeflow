import { FadeInWithSlideAnimation } from "@/components/animations";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/Filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { TagFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tags.action";
import { TagI } from "@/types/action";
import { RouteParams } from "@/types/glabal";

export default async function TagsPage({ searchParams }: RouteParams) {
  const { query, page, pageSize, filter } = await searchParams;
  const { data, success, errors } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  });
  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 ">
        <div className="flex w-full items-center justify-between flex-wrap gap-3">
          <LocalSeachBar
            route={ROUTES.TAGS}
            imageSrc="/icons/search.svg"
            placeholder="Search Tags.."
          />
          {data?.tags.length && (
            <CommonFilter
              filters={TagFilters}
              otherClasses="min-h-[56px] w-full sm:min-w-[170px]"
              containerClasses=""
            />
          )}
        </div>
        <DataRenderer
          success={success}
          data={tags}
          stateType={EMPTY_TAGS}
          error={errors}
          render={(tags: TagI[]) => {
            return (
              <div className="mt-6 flex w-full flex-wrap items-center gap-6 ">
                {tags.map(({ _id, name, usage }: TagI) => {
                  return (
                    <FadeInWithSlideAnimation key={String(_id!)}>
                      <TagCard
                        usage={usage}
                        quesionsCount={2}
                        name={name}
                        _id={String(_id!)}
                        key={String(_id!)}
                      />
                    </FadeInWithSlideAnimation>
                  );
                })}
              </div>
            );
          }}
        />

        <Pagination
          containerClasses="mt-6"
          page={page || 1}
          isNext={data?.isNext || false}
        />
      </section>
    </>
  );
}
