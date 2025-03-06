import { cn } from "@/lib/utils";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import { markddown } from "./mark-down-syles";
Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export default function Preview({ content }: { content: string }) {
  const formattedContent = content
    .replaceAll(/\\/g, "")
    .replaceAll(/&#x20;/g, "");
  return (
    <section className={cn("mt-6 prose  markdown grid break-words", markddown)}>
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
}
