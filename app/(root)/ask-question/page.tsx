import { auth } from "@/auth";
import QuesionForm from "@/components/Forms/QuesionForm";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function AskQuesionPage() {
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  return (
    <>
      <h1 className="h1-bold !text-dark-100 dark:!text-light-900">
        Ask a Question To the Public
      </h1>
      <div className="mt-10">
        <QuesionForm />
      </div>
    </>
  );
}
