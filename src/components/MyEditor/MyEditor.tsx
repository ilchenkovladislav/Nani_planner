import { cn } from "@/lib/utils";
import "./styles.scss";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { createPortal } from "react-dom";

export function MyEditor() {
    const editor = useEditor({
        extensions: [Document, Paragraph, Text, StarterKit, TaskList, TaskItem],
        content: "",
    });

    if (!editor) {
        return null;
    }

    return (
        <>
            {createPortal(
                <div className="fixed bottom-10 left-0 z-10 flex w-full justify-center gap-2">
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleTaskList().run()
                        }
                        className={cn("border p-1 text-center", {
                            "is-active": editor.isActive("taskList"),
                        })}
                    >
                        Список
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleBold().run()
                        }
                        className={cn("border p-1 text-center", {
                            "is-active": editor.isActive("bold"),
                        })}
                    >
                        bold
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleItalic().run()
                        }
                        className={cn("border p-1 text-center", {
                            "is-active": editor.isActive("italic"),
                        })}
                    >
                        italic
                    </button>
                </div>,
                document.querySelector("#root")!,
            )}

            <EditorContent className="rounded-md border" editor={editor} />
        </>
    );
}
