import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FadeInWithSlideAnimation } from "./animations";
import { Button } from "./ui/button";

interface DataRenderProps<T> {
  success: boolean;
  data: T[] | null | undefined;
  error?: {
    message: string;
    details: Record<string, string[]>;
  };
  stateType?: {
    title: string;
    message: string;
    button?: {
      href: string;
      text: string;
    };
  };

  render: (data: T[]) => ReactNode;
}
interface StateSkeltonPros {
  image: {
    dark: string;
    light: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    href: string;
    text: string;
  };
}
function StateSkelton({ image, title, message, button }: StateSkeltonPros) {
  return (
    <div className="mt-16 flex w-full flex-col items-center">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          height={200}
          width={270}
          priority
          loading="eager"
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          height={200}
          width={270}
          priority
          loading="eager"
          className="block object-contain dark:hidden"
        />
      </>
      <h2 className="h2-bold text-dark-200 dark:text-light-900 mt-8">
        {title}
      </h2>
      <p className="body-regular !text-dark-500 dark:!text-light-700  mt-1.5 max-w-md text-center">
        {message}
      </p>
      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg  bg-primary-400 px-4 py-3 text-light-900 hover:bg-primary-100!">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function DataRenderer<T>({
  success,
  error,
  data,
  render,
  stateType = DEFAULT_EMPTY,
}: DataRenderProps<T>) {
  if (!success)
    return (
      <FadeInWithSlideAnimation>
        <StateSkelton
          title={error?.message || DEFAULT_ERROR.title}
          button={DEFAULT_ERROR.button}
          message={
            error?.details
              ? JSON.stringify(error.details, null, 2)
              : DEFAULT_ERROR.message
          }
          image={{
            light: "/images/light-error.png",
            dark: "/images/dark-error.png",
            alt: "State Illustration image",
          }}
        />
      </FadeInWithSlideAnimation>
    );

  if (data === null || !data || data?.length === 0)
    return (
      <FadeInWithSlideAnimation>
        <StateSkelton
          title={stateType.title}
          button={stateType.button}
          message={stateType.message}
          image={{
            light: "/images/light-illustration.png",
            dark: "/images/dark-illustration.png",
            alt: "State Illustration image",
          }}
        />
      </FadeInWithSlideAnimation>
    );
  return render(data);
}
