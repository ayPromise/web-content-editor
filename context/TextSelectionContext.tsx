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
        if (!selection) return;

        const editor = document.getElementById("editor");
        const selectedNode = selection.anchorNode;
        if (!selectedNode) return;

        // Отримуємо реальні індекси вибраного тексту
        const start = Math.min(selection.anchorOffset, selection.focusOffset);
        const end = Math.max(selection.anchorOffset, selection.focusOffset);

        if (!editor?.contains(selection.baseNode)) return;

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
            let firstNode: SelectedNode = {
                node: startContainer,
                startIndex: range.startOffset,
                endIndex: startContainer.textContent?.length as number
            };

            const lastNode: SelectedNode = {
                node: endContainer,
                startIndex: 0,
                endIndex: range.endOffset
            };

            // Перетворюємо HTML-елементи в текстові ноди
            if (lastNode.node.nodeType !== Node.TEXT_NODE) {
                lastNode.node = getTextNode(lastNode.node as HTMLElement, lastNode.startIndex, lastNode.endIndex) as Text;
                lastNode.startIndex = 0;
                lastNode.endIndex = lastNode.node.textContent?.length as number;
            }
            if (firstNode.node.nodeType !== Node.TEXT_NODE) {
                firstNode.node = getTextNode(firstNode.node as HTMLElement, firstNode.startIndex, firstNode.endIndex) as Text;
                firstNode.startIndex = 0;
                firstNode.endIndex = firstNode.node.textContent?.length as number;
            }

            // Проходимо всі ноди між початковою і кінцевою
            while (firstNode.node !== lastNode.node) {
                orderedNodes.push(firstNode);
                const element = firstNode.node.parentElement !== lastChildOfEditor
                    ? firstNode.node.parentElement?.nextSibling
                    : firstNode.node.nextSibling;

                if (!element) break;
                const nextSiblingTextNode = element.nodeType !== Node.TEXT_NODE
                    ? getTextNode(element as HTMLElement, 0, element.textContent?.length as number)
                    : element;

                if (!nextSiblingTextNode) break;

                firstNode = { node: nextSiblingTextNode as Node, startIndex: 0, endIndex: nextSiblingTextNode.textContent?.length as number };
            }

            orderedNodes.push(lastNode);
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
