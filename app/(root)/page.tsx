import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="mr-0 flex min-h-screen w-full flex-col px-10">
      <h5>Welcome to home screen</h5>
    </main>
  );
}
