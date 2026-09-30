"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  // placeholder = 'Write something...',
  className = "",
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Underline,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] max-w-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [editor, value]);

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor?.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          type="button"
          title="Bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor?.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          type="button"
          title="Italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor?.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          type="button"
          title="Underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>
        <span className="mx-1 w-px h-5 bg-gray-300 dark:bg-gray-600"></span>
        <div className="flex space-x-1">
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }`}
            type="button"
            title="Heading 2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M4 12h16"></path>
              <path d="M4 18V6"></path>
              <path d="M20 18V6"></path>
            </svg>
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor?.isActive("heading", { level: 3 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }`}
            type="button"
            title="Heading 3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M6 12h12"></path>
              <path d="M6 20V4"></path>
              <path d="M18 20V4"></path>
            </svg>
          </button>
        </div>
        <span className="mx-1 w-px h-5 bg-gray-300 dark:bg-gray-600"></span>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor?.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          type="button"
          title="Bullet List"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor?.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }`}
          type="button"
          title="Ordered List"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
      </div>
      <div className="rich-text-content-wrapper bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-[200px]">
        <EditorContent editor={editor} />

        <style jsx global>{`
          .rich-text-content-wrapper .ProseMirror {
            padding: 1rem;
            min-height: 200px;
            outline: none;
          }

          /* Heading Styles */
          .rich-text-content-wrapper h1 {
            font-size: 2em;
            font-weight: bold;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
          }

          .rich-text-content-wrapper h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 0.83em;
            margin-bottom: 0.83em;
          }

          .rich-text-content-wrapper h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin-top: 1em;
            margin-bottom: 1em;
          }

          .rich-text-content-wrapper h4 {
            font-size: 1em;
            font-weight: bold;
            margin-top: 1.33em;
            margin-bottom: 1.33em;
          }

          /* List Styles */
          .rich-text-content-wrapper ul {
            display: block;
            list-style-type: disc;
            margin-top: 1em;
            margin-bottom: 1em;
            padding-left: 40px;
          }

          .rich-text-content-wrapper ol {
            display: block;
            list-style-type: decimal;
            margin-top: 1em;
            margin-bottom: 1em;
            padding-left: 40px;
          }

          .rich-text-content-wrapper li {
            display: list-item;
            margin-bottom: 0.5em;
          }

          .rich-text-content-wrapper ul li {
            list-style-type: disc;
          }

          .rich-text-content-wrapper ol li {
            list-style-type: decimal;
          }

          /* Nested Lists */
          .rich-text-content-wrapper ul ul,
          .rich-text-content-wrapper ol ul {
            list-style-type: circle;
          }

          .rich-text-content-wrapper ul ul ul,
          .rich-text-content-wrapper ol ul ul,
          .rich-text-content-wrapper ol ol ul,
          .rich-text-content-wrapper ul ol ul {
            list-style-type: square;
          }

          /* Paragraph Spacing */
          .rich-text-content-wrapper p {
            margin-top: 1em;
            margin-bottom: 1em;
          }

          .rich-text-content-wrapper p:first-child {
            margin-top: 0;
          }

          /* Dark mode adjustments */
          .dark .rich-text-content-wrapper h1,
          .dark .rich-text-content-wrapper h2,
          .dark .rich-text-content-wrapper h3,
          .dark .rich-text-content-wrapper h4,
          .dark .rich-text-content-wrapper h5,
          .dark .rich-text-content-wrapper h6 {
            color: white;
          }

          .dark .rich-text-content-wrapper {
            color: #e5e7eb;
          }
        `}</style>
      </div>
    </div>
  );
};
