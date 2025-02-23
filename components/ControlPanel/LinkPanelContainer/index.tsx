import React, { useEffect, useState } from "react";
import LinkPanel from "./LinkPanel";
import restoreSelection from "@/utils/restoreSelection";

import { Link02Icon } from "@/icons";
import { useTextSelection } from "@/context/TextSelectionContext";

const LinkPanelContainer = () => {
    const { selectedText, handleTextSelect } = useTextSelection()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        if (!selectedText) return
    }, [selectedText])

    const handleOpenPanel = () => {
        remainSelection();
        setIsOpen(!isOpen);
    };

    const handleUrlChangeSubmit = (newUrl: string) => {
        setUrl(newUrl);
        setIsOpen(false);
        handleChangeElementToLink(newUrl)
    };

    const handleChangeElementToLink = (newUrl: string) => {
        // store the old state element
        const oldElement = selectedText?.fromTextNode?.node.parentElement

        // create a var for storing the new element with different newTag
        const newElement = document.createElement("a")

        // share the content and styles with new temp var
        newElement.textContent = oldElement?.textContent
        newElement.setAttribute("href", "https://youtube.com")
        newElement.setAttribute("target", "_blank")
        newElement.setAttribute("rel", "noopener noreferrer nofollow")

        // render new element after the old one and remove it instantly
        oldElement?.replaceChild(newElement, selectedText?.fromTextNode?.node)

        // put cursor pointer on the start of the new element
        restoreSelection(newElement, 0, 0)
        // call the handler for stating the selection value
        handleTextSelect()
    }



    const remainSelection = () => {
        if (!selectedText?.fromTextNode) return;
        if (selectedText.fromTextNode.startIndex === selectedText.fromTextNode.endIndex) return;

        const { node, startIndex, endIndex } = selectedText.fromTextNode;
        restoreSelection(node, startIndex, endIndex);
    };

    return (
        <>
            <span
                className={`stylingButton ${url || isOpen ? "active" : ""}`}
                onClick={handleOpenPanel}
            >
                <Link02Icon color="white" className="size-[18px]" />
            </span>

            {isOpen && <LinkPanel value={url} onSubmit={handleUrlChangeSubmit} />}
        </>
    );
};

export default LinkPanelContainer;
