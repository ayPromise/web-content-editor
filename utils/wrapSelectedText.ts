const wrapSelectedText = (
    fromTextNode: Node,
    startIndex: number,
    endIndex: number,
    className: string,
    tagName?:string
): ChildNode | null => {
    const textNode = fromTextNode;
    const parentOfTextNode = fromTextNode.parentElement as HTMLElement

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) return null;


    // Extract text parts
    const beforeSelectedPart = textNode.textContent.slice(0, startIndex);
    const selectedPart = textNode.textContent.slice(startIndex, endIndex);
    const afterSelectedPart = textNode.textContent.slice(endIndex);

    // Create a <span> for the wrapped text
    const element = document.createElement(tagName||"span");
    if(className) element.classList.add(className);
    element.textContent = selectedPart;
    
    
    // Replace the original text with the wrapped version
    parentOfTextNode.replaceChild(element, textNode);

    parentOfTextNode.insertBefore(document.createTextNode(beforeSelectedPart),element)
    element.after(document.createTextNode(afterSelectedPart))

    return element.firstChild;
};

export default wrapSelectedText
