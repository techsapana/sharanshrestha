"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-5",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-5",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "leading-relaxed",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-400 pl-4 italic text-gray-700 py-2",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "max-w-none p-4 focus:outline-none min-h-[300px] text-black leading-7",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border-2 border-gray-300 rounded mb-4 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b-2 border-gray-300 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold transition ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic transition ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded line-through transition ${
            editor.isActive("strike")
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          S
        </button>
        <div className="w-px h-6 bg-gray-300 self-center" />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded font-bold transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded font-bold transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded font-bold transition ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 self-center" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded transition ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded transition ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 self-center" />
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-100 transition"
          type="button"
        >
          ―
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          ↷ Redo
        </button>
      </div>

      <style>{`
        .tiptap h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          line-height: 1.2;
        }
        .tiptap h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          line-height: 1.2;
        }
        .tiptap h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
          line-height: 1.2;
        }
        .tiptap ul,
        .tiptap ol {
          margin: 1em 0;
        }
        .tiptap li {
          margin-left: 1.5em;
          list-style-position: outside;
        }
        .tiptap blockquote {
          margin: 1em 0;
        }
      `}</style>

      <div className="tiptap">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
