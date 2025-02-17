export const wrapSelectedText = (
    fromTextNode: Node,
    startIndex: number,
    endIndex: number,
    className: string
): ChildNode | null => {
    const textNode = fromTextNode;
    const parentOfTextNode = fromTextNode.parentElement as HTMLElement
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) return null;

    // Extract text parts
    const beforeSelectedPart = textNode.textContent.slice(0, startIndex);
    const selectedPart = textNode.textContent.slice(startIndex, endIndex);
    const afterSelectedPart = textNode.textContent.slice(endIndex);

    // Create a <span> for the wrapped text
    const span = document.createElement("span");
    span.classList.add(className);
    span.textContent = selectedPart;

    // Assemble the new text structure
    const fragment = document.createDocumentFragment();
    if (beforeSelectedPart) fragment.appendChild(document.createTextNode(beforeSelectedPart));
    fragment.appendChild(span);
    if (afterSelectedPart) fragment.appendChild(document.createTextNode(afterSelectedPart));

    // Replace the original text with the wrapped version
    parentOfTextNode.replaceChild(fragment, textNode);

    return span.firstChild;
};
