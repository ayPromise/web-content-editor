export const wrapSelectedText = (
    parentElement: HTMLElement,
    startIndex: number,
    endIndex: number,
    className: string
): HTMLElement | null => {
    const textNode = parentElement.firstChild;
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
    parentElement.replaceChild(fragment, textNode);

    return span;
};
