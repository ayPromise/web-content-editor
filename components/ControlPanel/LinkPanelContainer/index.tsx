import React, { useState } from "react";
import Conditional from "@/components/Conditional";
import LinkPanel from "./LinkPanel";
import restoreSelection from "@/utils/restoreSelection";

import { Link02Icon } from "@/icons";
import { SelectedTextProps, useTextSelection } from "@/context/TextSelectionContext";

interface LinkPanelContainerProps {
    selectedText: SelectedTextProps | null;
    onApply: (url: string) => void;
}

const LinkPanelContainer = ({ onApply }: LinkPanelContainerProps) => {
    const { selectedText } = useTextSelection()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");

    const handleOpenPanel = () => {
        remainSelection();
        setIsOpen(!isOpen);
    };

    const handleUrlChangeSubmit = (newUrl: string) => {
        setUrl(newUrl);
        onApply(newUrl);
        setIsOpen(false);
    };

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

            <Conditional showWhen={isOpen}>
                <LinkPanel value={url} onSubmit={handleUrlChangeSubmit} />
            </Conditional>
        </>
    );
};

export default LinkPanelContainer;
