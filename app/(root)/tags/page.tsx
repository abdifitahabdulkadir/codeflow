import { getTags } from "@/lib/actions/tags.action";

export default async function TagsPage() {
  const { data } = await getTags({
    page: 1,
    pageSize: 10,
    filter: "recent",
    query: "nodejs",
  });
  const { tags } = data || {};
  console.log(tags);
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <h6>tags page will be here</h6>
    </div>
  );
}
