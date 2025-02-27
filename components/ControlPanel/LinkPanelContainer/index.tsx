import React, { useEffect, useState } from "react";
import LinkPanel from "./LinkPanel";
import restoreSelection from "@/utils/restoreSelection";

import { Link02Icon, MultiplicationSignIcon } from "@/icons";
import { useTextSelection } from "@/context/TextSelectionContext";
import disassembleElement from "@/utils/dissembleElements";
import splitHTMLElement from "@/utils/splitHTMLElement";
import useTextStyling from "@/hooks/useTextStyling";

const LinkPanelContainer = () => {
    const { selectedText, handleTextSelect } = useTextSelection()
    const { stylingState, setStylingState } = useTextStyling(selectedText)

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpenPanel = () => {
        remainSelection();

        if (!selectedText) return
        if (!selectedText.multipleNodes && selectedText.fromTextNode?.startIndex === selectedText.fromTextNode?.endIndex) return
        setIsOpen(!isOpen);
    };

    const handleUrlChangeSubmit = (newUrl: string) => {
        setIsOpen(false);
        handleChangeElementToLink(newUrl)
    };

    const handleChangeElementToLink = (newUrl: string) => {

        // if we do select single element
        if (selectedText?.fromTextNode) {
            const { node, startIndex, endIndex } = selectedText.fromTextNode
            // store the old state element
            const selectedElement = node.parentElement?.tagName === "P"
                ?
                node
                :
                node.parentElement

            // create a var for storing the new element with different newTag
            const link = document.createElement("a")

            // share the content and styles with new temp var
            link.setAttribute("href", newUrl)
            link.setAttribute("target", "_blank")
            link.setAttribute("rel", "noopener noreferrer nofollow")

            // count the selected letters and length of the content
            const countOfLettersSelected = endIndex - startIndex;
            const contentOfSelectedElement = selectedElement.textContent as string;

            // we must render the link element before moving content
            selectedElement.after(link)

            // if we did select only a part of the whole element
            if (contentOfSelectedElement.length !== countOfLettersSelected) {
                const selectedPart = splitHTMLElement(selectedElement, startIndex, endIndex)
                link.appendChild(selectedPart)
            } else {
                link.appendChild(selectedElement as Node)
            }

            // call the handler for stating the selection value
            handleTextSelect()
        }

        // if we do select multiple elements
        else if (selectedText?.multipleNodes) {
            const nodes = selectedText.orderedNodes

            if (!nodes) return

            const link = document.createElement("a")
            link.setAttribute("href", newUrl)
            link.setAttribute("target", "_blank")
            link.setAttribute("rel", "noopener noreferrer nofollow")
            let flag: boolean = true

            nodes.forEach((nodeObject) => {

                if (nodeObject.node.parentElement?.tagName === "CODE") return

                let currentElement: HTMLElement = nodeObject.node

                // take the last element before <p>
                if (currentElement.parentElement.parentElement && currentElement.parentElement.parentElement.id !== 'editor')
                    currentElement = currentElement.parentElement

                if (nodeObject.node.parentElement === currentElement.parentElement) {
                    const { node, startIndex, endIndex } = nodeObject

                    // we render the link before adding the content to it
                    if (flag) {
                        node.after(link)
                        // only once
                        flag = false
                    }
                    // we operate with text Node
                    const elementObj = disassembleElement(currentElement, startIndex, endIndex, '', true, 'span')
                    if (elementObj) link.appendChild(elementObj.fromElement)

                } else {
                    // we operate with HTML Element
                    const { node, startIndex, endIndex } = nodeObject
                    const element = node.parentElement as HTMLElement

                    // we render the link before adding the content to it
                    if (flag) {
                        node.after(link)
                        // only once
                        flag = false
                    }

                    const selectedElement = splitHTMLElement(element, startIndex, endIndex)
                    link.appendChild(selectedElement)
                }
            })

            // put cursor pointer on the start of the new element
            restoreSelection(link, 0, 0)

        }

    }

    const remainSelection = () => {
        if (!selectedText?.fromTextNode) return;
        if (selectedText.fromTextNode.startIndex === selectedText.fromTextNode.endIndex) return;

        const { node, startIndex, endIndex } = selectedText.fromTextNode;
        restoreSelection(node, startIndex, endIndex);
    };

    const handleRemoveLink = (event: MouseEvent) => {
        event.stopPropagation()
        const anchor = selectedText?.fromTextNode?.node.parentElement?.closest("a") || selectedText?.orderedNodes[0].node.parentElement?.closest("a")
        if (!anchor) return

        // Replace the <a> with its children
        const parent = anchor.parentElement;
        while (anchor.firstChild) {
            parent?.insertBefore(anchor.firstChild, anchor);
        }

        // Remove the empty <a> tag
        anchor.remove();
        setStylingState({ ...stylingState, linkURL: '' })
    }

    return (
        <>
            <span
                className={`relative  stylingButton ${stylingState.linkURL || isOpen ? "active" : ""}`}
                onClick={handleOpenPanel}
            >
                <Link02Icon color="white" className="size-[18px]" />
                {!!stylingState.linkURL &&
                    <div className="absolute -right-1 -top-1 bg-slate-100 rounded hover:bg-slate-300 hover:scale-125 z-20" onClick={handleRemoveLink}>
                        <MultiplicationSignIcon color="white" className="size-[15px]" />
                    </div>
                }
            </span>

            {isOpen && <LinkPanel value={stylingState.linkURL} onSubmit={handleUrlChangeSubmit} />}
        </>
    );
};

export default LinkPanelContainer;
