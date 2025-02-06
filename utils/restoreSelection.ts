export const restoreSelection = (
    targetElement: HTMLElement,
    startIndex: number,
    endIndex: number
) => {
    const selection = window.getSelection();
    if (!selection) return;

    // Find the first text node inside the element
    const textNode: ChildNode | null = targetElement.firstChild;

    if (!textNode) return;

    // Ensure we don't exceed the text length
    const safeEndIndex = Math.min(endIndex, textNode.textContent?.length || 0);

    // Create a new range and set selection
    const newRange = document.createRange();
    newRange.setStart(textNode, startIndex);
    newRange.setEnd(textNode, safeEndIndex);
    selection.removeAllRanges();
    selection.addRange(newRange);
};
