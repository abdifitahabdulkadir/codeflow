import Image from "next/image";

import { ReactNode } from "react";

import SocailAuthForm from "@/components/Forms/SocailAuthForm";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen w-full items-center justify-center gap-4 bg-auth-light bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-auth-dark">
      <div className="border-light-800 dark:border-dark-300 bg-light-800 dark:bg-dark-200 ms:min-w-[520px] rounded-[10px] border px-4 py-10 shadow-light-100 sm:px-8">
        <div className="border-light-800 dark:border-dark-300-2 flex items-center justify-between gap-y-2 border-b pb-6">
          <div className="space-y-2.5">
            <h1 className="h2-bold !text-dark-100 dark:!text-light-900">
              Join <span className="text-primary-400"> CodeFlow</span>
            </h1>
            <p className="paragraph-regular text-dark-400 dark:text-light-500">
              To get Quesions Answered
            </p>
          </div>
          <Image
            src="/images/site-logo.svg"
            width={50}
            height={50}
            alt="codeflow logo"
            loading="eager"
            priority
            className="object-contain"
          />
        </div>

        {children}
        <SocailAuthForm />
      </div>
    </section>
  );
}
