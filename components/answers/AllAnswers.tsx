import { AnswerFilters } from "@/constants/filters";
import { EMPTY_ANSWERS } from "@/constants/states";
import { AnswerI } from "@/types/action";
import { ActionResponse } from "@/types/glabal";
import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";
import CommonFilter from "../Filters/CommonFilter";
import Pagination from "../Pagination";

interface Props extends ActionResponse<AnswerI[]> {
  totalAnswers: number;
  page: number;
  isNext: boolean;
}
export default function AllAnswers({
  data,
  success,
  totalAnswers,
  isNext,
  page,
  errors,
}: Props) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers <= 1 ? "Answer" : "Answers"}{" "}
        </h3>
        {data?.length ? (
          <CommonFilter
            filters={AnswerFilters}
            otherClasses="sm:win-32"
            containerClasses="mx-xs:w-full"
          />
        ) : null}
      </div>

      <DataRenderer
        data={data}
        success={success}
        stateType={EMPTY_ANSWERS}
        error={errors}
        render={(answers) => {
          return answers.map((item) => {
            return <AnswerCard _id={item._id} {...item} />;
          });
        }}
      />

      {data?.length ? (
        <Pagination page={page || 1} isNext={isNext || false} />
      ) : null}
    </div>
  );
}
