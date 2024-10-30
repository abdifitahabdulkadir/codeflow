import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar/Navbar";
import RightSidebar from "@/components/navigation/RightSidebar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="background-light850_dark100 min-h-screen w-full">
      <Navbar />
      <section className="flex justify-between">
        <LeftSidebar />
        <div className="flex min-h-screen flex-1 px-6 pb-6 pt-36 max-md:px-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>

        <RightSidebar />
      </section>
    </main>
  );
}
