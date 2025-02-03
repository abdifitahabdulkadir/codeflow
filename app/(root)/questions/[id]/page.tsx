import TagCard from "@/components/cards/TagCard";
import CustomAvator from "@/components/customAvator";
import Preview from "@/components/Editor/Preview";
import Metric from "@/components/Metric";
import { ROUTES } from "@/constants/routes";
import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { RouteParams } from "@/types/glabal";
import Link from "next/link";
const sampleQuestion = {
  id: "q123",
  title: "How to improve React app performance?",
  content: `### Question
I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?
#### What I've Tried:
- Lazy loading components
- Using React.memo on some components
- Managing state with React Context API
#### Issues:
- The app still lags when rendering large lists.
- Switching between pages feels sluggish.
- Sometimes, re-renders happen unexpectedly.
#### Key Areas I Need Help With:
1. Efficiently handling large datasets.
2. Reducing unnecessary re-renders.
3. Optimizing state management.
Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:
\`\`\`js
import React, { useState, useMemo } from "react";
const LargeList = ({ items }) => {
  const [filter, setFilter] = useState("");
  // Filtering items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);
  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
export default LargeList;
\`\`\`
#### Questions:
1. Is using \`useMemo\` the right approach here, or is there a better alternative?
2. Should I implement virtualization for the list? If yes, which library would you recommend?
3. Are there better ways to optimize state changes when dealing with user input and dynamic data?
Looking forward to your suggestions and examples!
**Tags:** React, Performance, State Management
  `,
  createdAt: "2025-01-15T12:34:56.789Z",
  upvotes: 42,
  downvotes: 3,
  views: 1234,
  answers: 5,
  tags: [
    { _id: "tag1", name: "React" },
    { _id: "tag2", name: "Node" },
    { _id: "tag3", name: "PostgreSQL" },
  ],
  author: {
    _id: "u456",
    name: "Jane Doe",
    image: "/avatars/jane-doe.png",
  },
};
export default async function QuestionDetailPage({ params }: RouteParams) {
  const { id } = await params;

  const { author, createdAt, answers, views, tags, title, content } =
    sampleQuestion;
  return (
    <>
      <div className="flex-start  w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <CustomAvator userId={author._id} name={author.name} />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <p> Votes</p>
          </div>
        </div>

        <h2 className="h2-semibold text-dark300_light900  mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="flex w-full gap-2 flex-wrap mt-4">
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/clock.svg"}
          alt="clock icon"
          value={""}
          title={`Asked ${formatTimeAgo(new Date(createdAt))}`}
        />
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/message.svg"}
          alt="message icon"
          value={""}
          title={formatNumber(answers)}
        />
        <Metric
          textStyles="small-reguar text-dark400_light700"
          imageUrl={"/icons/eye.svg"}
          alt="clock icon"
          value={""}
          title={formatNumber(views)}
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((each: TagI) => {
          return (
            <TagCard
              key={each._id}
              _id={each._id as string}
              name={each.name}
              compact
            />
          );
        })}
      </div>
    </>
  );
}
