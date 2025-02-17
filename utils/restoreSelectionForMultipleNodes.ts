const restoreSelectionForMultipleNodes = (firstElement:Node, lastElement:Node, startIndex:number, endIndex:number)=>{
    const selection = window.getSelection();
    if (!selection) return;

    // Create a new range and set selection
    const newRange = document.createRange();
    newRange.setStart(firstElement, startIndex);
    newRange.setEnd(lastElement, endIndex);
    selection.removeAllRanges();
    selection.addRange(newRange);
}

export default restoreSelectionForMultipleNodes