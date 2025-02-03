import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Brackets,
  CodeIcon,
  Divide,
  Heading,
  ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  StrikethroughIcon,
  Undo,
} from "lucide-react";
export default function EditorToolbar({
  editor,
  content,
}: {
  editor: Editor | null;
  content: string;
}) {
  return (
    <div className="w-full flex items-center gap-2 lg:justify-between pb-2 border-b border-b-light-400 flex-wrap ">
      <BoldIcon
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBold().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("bold") ? " bg-400/40" : "",
        )}
      />

      <ItalicIcon
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleItalic().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("italic") ? " bg-400/40" : "",
        )}
      />

      <StrikethroughIcon
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleStrike().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("strike") ? " bg-400/40" : "",
        )}
      />
      <CodeIcon
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleCode().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("code") ? " bg-400/40" : "",
        )}
      />
      <Quote
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBlockquote().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("blockquote") ? " bg-400/40" : "",
        )}
      />
      <Brackets
        onClick={(e) => {
          e.preventDefault();
          editor
            ?.chain()
            .focus()
            .toggleCodeBlock({ language: "javascript" })
            .run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("codeBlock") ? " bg-400/40" : "",
        )}
      />
      <Heading
        onClick={(e) => {
          e.preventDefault();
          editor
            ?.chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("heading") ? " bg-400/40" : "",
        )}
      />
      <List
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBulletList().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("bulletList") ? " bg-400/40" : "",
        )}
      />
      <ListOrdered
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleOrderedList().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("orderedList") ? " bg-400/40" : "",
        )}
      />
      <Undo
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().undo().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("undo") ? " bg-400/40" : "",
        )}
      />
      <Redo
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().redo().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("redo") ? " bg-400/40" : "",
        )}
      />
      <Divide
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().setHorizontalRule().run();
        }}
        className={cn(
          "text-dark-500 cursor-pointer dark:text-light-800 px-2 rounded size-10",
          editor?.isActive("redo") ? " bg-400/40" : "",
        )}
      />
    </div>
  );
}
