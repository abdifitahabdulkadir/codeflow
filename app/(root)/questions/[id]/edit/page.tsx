import { auth } from "@/auth";
import QuesionForm from "@/components/Forms/QuesionForm";
import { ROUTES } from "@/constants/routes";
import { TagDoc } from "@/database/tags.model";
import { getQuestionDetail } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/glabal";
import { notFound, redirect } from "next/navigation";

export default async function EditQuestionPage({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();
  const { data: question, success } = await getQuestionDetail({
    questionId: id,
  });
  if (!success) return notFound();
  const session = await auth();

  // if currnt user is the author of question
  if (session?.user?.id?.toString() !== question.authorId.toString())
    return redirect(ROUTES.QUESIONS(id));

  const { content, title, tags } = question;
  const currentTags: string[] = tags.map((tag: TagDoc) => tag.name);
  return (
    <main>
      <div className="mt-10">
        <QuesionForm
          content={content}
          tags={currentTags}
          questionId={id}
          title={title}
          isEdit={true}
        />
      </div>
    </main>
  );
}
