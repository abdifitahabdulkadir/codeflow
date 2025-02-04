import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import "./dark-editor.css";
export default function ContentEditor({
  content,
  onChangeHandle,
}: {
  content: string;
  onChangeHandle: (input: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, BulletList, ListItem],
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class:
          "outline-hidden prose prose-strong:text-current dark:prose-invert max-w-none [&_ol]:list-decimal [&_ul]:list-disc text-md px-3 py-2 min-h-[14rem] !text-dark-300 font-medium dark:!text-light-800 markdown grid prose-xs focus:outline-hidden rounded-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChangeHandle(editor?.getHTML());
    },
  });

  return (
    <div className="flex focus-within:ring-1  focus-within:ring-light-800    flex-col gap-2 w-full rounded-2  background-light900_dark300  py-6 px-2 ">
      <EditorToolbar content={content} editor={editor} />
      <EditorContent
        style={{
          whiteSpace: "pre-line",
        }}
        className=" overflow-y-auto grow w-full max-h-[16rem] max-w-3xl   min-h-[15rem]"
        editor={editor}
      />
    </div>
  );
}
