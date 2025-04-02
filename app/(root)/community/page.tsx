import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSeachBar from "@/components/search/LocalSeachBar";
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
        <LocalSeachBar
          placeholder="There are great devs here"
          imageSrc="/icons/search.svg"
          iconPositon="left"
          route={ROUTES.COMMUNITY}
          otherClasses="flex-1"
        />

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
    </div>
  );
}
