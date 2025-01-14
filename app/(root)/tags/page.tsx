import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { ROUTES } from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tags.action";
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
      <section className="mt-11">
        <LocalSeachBar
          route={ROUTES.TAGS}
          imageSrc="/icons/search.svg"
          placeholder="Search Tags.."
        />
        <DataRenderer
          success={success}
          data={tags}
          stateType={EMPTY_TAGS}
          error={errors}
          render={(tags: TagI[]) => {
            return (
              <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-6 ">
                {tags.map(({ _id, name, usage }: TagI) => {
                  return (
                    <TagCard
                      usage={usage}
                      quesionsCount={2}
                      name={name}
                      _id={String(_id!)}
                      key={String(_id!)}
                    />
                  );
                })}
              </div>
            );
          }}
        />
      </section>
    </>
  );
}
