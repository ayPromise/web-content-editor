import type { Meta, StoryObj } from "@storybook/react";
import EditorContainer from "./EditorContainer";

const meta = {
    title: "Editor",
    component: EditorContainer,
    parameters: {
        layout: "centered"
    },
    tags: ['autodocs']
} satisfies Meta<typeof EditorContainer>

export default meta;

type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        children: <>

        </>
    }
}