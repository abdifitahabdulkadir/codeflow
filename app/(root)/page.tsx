import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <main className="mr-0 flex h-[600px] w-full flex-col items-center justify-center border border-red-400 px-1">
      <form
        className="flex h-fit w-fit flex-col gap-4"
        action={async () => {
          "use server";
          await signOut({
            redirectTo: ROUTES.SIGN_IN,
          });
        }}
      >
        <Button type="submit" className="bg-black text-white">
          Logout
        </Button>
      </form>
    </main>
  );
}
