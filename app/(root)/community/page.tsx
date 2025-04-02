import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/Filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSeachBar from "@/components/search/LocalSeachBar";
import { UserFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/action.user";
import { cn } from "@/lib/utils";
import { PageParams } from "@/types/glabal";

export default async function CommunityPage({ searchParams }: PageParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { data, success, errors } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  return (
    <div>
      <h1 className="h1-bold text-dark400_light700">All Users</h1>
      <div className="mt-11">
        <div className="w-full flex  justify-between gap-3 flex-wrap">
          <LocalSeachBar
            placeholder="There are great devs here"
            imageSrc="/icons/search.svg"
            iconPositon="left"
            route={ROUTES.COMMUNITY}
          />
          <CommonFilter
            filters={UserFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses=""
          />
        </div>

        <DataRenderer
          success={success}
          data={data?.users}
          stateType={EMPTY_USERS}
          error={errors}
          render={(users) => {
            return (
              <div
                className={cn(
                  "w-full flex  flex-wrap gap-2",
                  "max-sm:items-center max-sm:justify-center",
                )}
              >
                {users.map((user) => {
                  return <UserCard key={user._id} user={user} />;
                })}
              </div>
            );
          }}
        />
      </div>
      <Pagination
        containerClasses="mt-6"
        page={page || 1}
        isNext={data?.isNext || false}
      />
    </div>
  );
}
