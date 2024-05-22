import { generateText } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

export function jsonToText(json: string) {
    return generateText(
        JSON.parse(json),
        [Document, Paragraph, Bold, Italic, Text, TaskList, TaskItem],
        {
            blockSeparator: " ",
        },
    ).trim();
}
