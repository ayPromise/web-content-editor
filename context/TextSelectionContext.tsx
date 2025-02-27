import { createContext, useContext, useState, ReactNode } from "react";
import getTextNode from "@/utils/getTextNode";

export interface SelectedNode {
    node: Node;
    startIndex: number;
    endIndex: number;
}

export interface SelectedTextProps {
    fromTextNode?: SelectedNode;
    multipleNodes?: boolean;
    orderedNodes?: SelectedNode[];
    mainElement: HTMLElement;
}

interface TextSelectionContextType {
    selectedText: SelectedTextProps | null;
    handleTextSelect: () => void;
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined);

export const TextSelectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedText, setSelectedText] = useState<SelectedTextProps | null>(null);

    const handleTextSelect = () => {
        const selection = window.getSelection();
        if (!selection) return

        const editor = document.getElementById("editor");
        const selectedNode = selection.anchorNode;
        if (!selectedNode) {
            //setSelectedText(null)
            return;
        }

        // Отримуємо реальні індекси вибраного тексту
        const start = Math.min(selection.anchorOffset, selection.focusOffset);
        const end = Math.max(selection.anchorOffset, selection.focusOffset);

        if (!editor?.contains(selection.baseNode)) return

        // Знаходимо кореневий елемент вибору
        let lastChildOfEditor = selection.baseNode;
        while (lastChildOfEditor.parentElement && lastChildOfEditor.parentElement.id !== "editor") {
            lastChildOfEditor = lastChildOfEditor.parentElement;
        }

        const aloneNode: SelectedNode = { node: selection.baseNode, startIndex: start, endIndex: end };
        const range = selection.getRangeAt(0);

        const startContainer = range.startContainer.childNodes[range.startOffset] || range.startContainer;
        const endContainer = range.startContainer.childNodes[range.endOffset - 1] || range.endContainer;

        if (range.startContainer !== range.endContainer) {
            const orderedNodes: SelectedNode[] = [];
            let current: SelectedNode = {
                node: startContainer,
                startIndex: range.startOffset,
                endIndex: startContainer.textContent?.length as number
            };

            const last: SelectedNode = {
                node: endContainer,
                startIndex: 0,
                endIndex: range.endOffset
            };

            // transform HTML into Text Node
            if (last.node.nodeType !== Node.TEXT_NODE) {
                last.node = getTextNode(last.node as HTMLElement, last.startIndex, last.endIndex) as Text;
                last.startIndex = 0;
                last.endIndex = last.node.textContent?.length as number;
            }
            if (current.node.nodeType !== Node.TEXT_NODE) {
                current.node = getTextNode(current.node as HTMLElement, current.startIndex, current.endIndex) as Text;
                current.startIndex = 0;
                current.endIndex = current.node.textContent?.length as number;
            }

            // go through from start to end
            while (current.node !== last.node) {
                orderedNodes.push(current);
                let parent = current.node.parentElement
                // if we are still inside lastChildOfEditor we go up
                if (parent?.parentElement.tagName === "A")
                    parent = parent.parentElement
                const element = parent !== lastChildOfEditor
                    ? parent?.nextSibling
                    : current.node.nextSibling;

                if (!element) break;
                const nextSiblingTextNode = element.nodeType !== Node.TEXT_NODE
                    ? getTextNode(element as HTMLElement, 0, element.textContent?.length as number)
                    : element;

                if (!nextSiblingTextNode) break;

                current = { node: nextSiblingTextNode as Node, startIndex: 0, endIndex: nextSiblingTextNode.textContent?.length as number };
            }

            orderedNodes.push(last);
            setSelectedText({ orderedNodes, multipleNodes: true, mainElement: lastChildOfEditor });
        } else {
            setSelectedText({ fromTextNode: aloneNode, mainElement: lastChildOfEditor });
        }
    };

    return (
        <TextSelectionContext.Provider value={{ selectedText, handleTextSelect }}>
            {children}
        </TextSelectionContext.Provider>
    );
};

// **Хук для зручного використання контексту**
export const useTextSelection = () => {
    const context = useContext(TextSelectionContext);
    if (!context) {
        throw new Error("useTextSelection must be used within a TextSelectionProvider");
    }
    return context;
};
