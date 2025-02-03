import { auth } from "@/auth";
import QuesionForm from "@/components/Forms/QuesionForm";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function AskQuesionPage() {
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">
        Ask a Question To the Public
      </h1>
      <div className=" max-w-full ">
        <QuesionForm />
        {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
          return (
            <div key={item} className=" w-full h-[10rem]">
              {item}
            </div>
          );
        })} */}
      </div>
    </>
  );
}
