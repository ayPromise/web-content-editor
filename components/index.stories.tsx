import type { Meta, StoryObj } from "@storybook/react";
import Editor from "./Editor";
import EditorContainer from "./EditorContainer";
import ControlPanel from "./ControlPanel";

const meta = {
    title: "Editor",
    component: EditorContainer,
    parameters: {
        layout: "centered"
    },
    tags: ['autodocs']
} satisfies Meta<typeof Editor>

export default meta;

type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        children: <>
            <ControlPanel />
            <Editor />
        </>
    }
}