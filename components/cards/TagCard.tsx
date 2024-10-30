import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { getDevCLass } from "@/lib/utils";

interface ProsType {
  _id: string;
  name: string;
  quesionsCount: number;
  showCount?: boolean;
  compact?: boolean;
}

export default function TagCard({
  _id,
  name,
  quesionsCount,
  showCount,
 }: ProsType) {
  const className = getDevCLass(name);
  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 rounded-md border-none px-4 py-2 uppercase">
        <div className="text-dark500_light500 flex items-center gap-x-2">
          <i className={className + " text-xs"}></i>
          {name}
        </div>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700 font-bold">
          {quesionsCount + "+"}
        </p>
      )}
    </Link>
  );
}
