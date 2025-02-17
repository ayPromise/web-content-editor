const getTextNode = (element: HTMLElement, startIndex: number, endIndex: number): Text | null => {
    let currentIndex = 0; // Tracks the current position in the text content

    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const textLength = node.textContent?.length || 0;

            // If the range falls within this text node
            if (currentIndex <= startIndex && currentIndex + textLength >= endIndex) {
                return node as Text;
            }

            currentIndex += textLength; // Move to the next text node position
        }
    }

    return null; // No matching text node found
};

export default getTextNode
