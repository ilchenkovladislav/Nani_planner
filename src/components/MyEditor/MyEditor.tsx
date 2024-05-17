import { cn } from "@/lib/utils";
import "./styles.scss";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { createPortal } from "react-dom";
import { animated, useSpring } from "@react-spring/web";
import { IoCheckboxOutline } from "react-icons/io5";
import { FiBold } from "react-icons/fi";
import { FiItalic } from "react-icons/fi";

type MyEditorProps = {
    onFocus: () => void;
    onUpdate: () => void;
    content?: JSONContent | string;
};

export function MyEditor({ onFocus, onUpdate, content }: MyEditorProps) {
    const editor = useEditor(
        {
            extensions: [
                Document,
                Paragraph,
                Bold,
                Italic,
                Text,
                TaskList,
                TaskItem,
                Placeholder.configure({ placeholder: "Начните ввод" }),
            ],
            content: content ?? "",
            onFocus,
            onUpdate,
        },
        [content],
    );

    const styles = useSpring({ opacity: editor?.isFocused ? 1 : 0 });

    if (!editor) {
        return null;
    }

    return (
        <>
            <EditorContent className="h-full" editor={editor} />

            {createPortal(
                <animated.div
                    style={styles}
                    className={cn(
                        "fixed bottom-0 left-0 z-10 flex w-full justify-center gap-2 border-t bg-background",
                    )}
                >
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleBold().run()
                        }
                        className={cn("p-5 text-center text-lg", {
                            "is-active": editor.isActive("bold"),
                        })}
                    >
                        <FiBold />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleItalic().run()
                        }
                        className={cn("p-5 text-center text-lg", {
                            "is-active": editor.isActive("italic"),
                        })}
                    >
                        <FiItalic />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleTaskList().run()
                        }
                        className={cn("p-5 text-center text-xl", {
                            "is-active": editor.isActive("taskList"),
                        })}
                    >
                        <IoCheckboxOutline />
                    </button>
                </animated.div>,
                document.querySelector("#root")!,
            )}
        </>
    );
}
