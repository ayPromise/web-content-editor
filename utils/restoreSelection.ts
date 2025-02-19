const restoreSelection = (
    targetElement: Node,
    startIndex: number,
    endIndex: number
) => {
    const selection = window.getSelection();
    if (!selection) return;

    // Ensure we don't exceed the text length
    const safeEndIndex = Math.min(endIndex, targetElement.textContent?.length || 0);

    // Create a new range and set selection
    const newRange = document.createRange();
    newRange.setStart(targetElement, startIndex);
    newRange.setEnd(targetElement, safeEndIndex);
    selection.removeAllRanges();
    selection.addRange(newRange);
};

export default restoreSelection
