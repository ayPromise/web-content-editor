const splitHTMLElement = (element: HTMLElement, startIndex: number, endIndex: number) => {
    const previousPart: string = element.textContent.slice(0, startIndex);
    const theSelectedPart: string = element.textContent.slice(startIndex, endIndex);
    const nextPart: string = element.textContent.slice(endIndex, element.textContent.length);

    const createElement = (content: string) => {
        const newElement = document.createElement(element.tagName);
        newElement.classList.add(...Array.from(element.classList));
        newElement.innerHTML = content;
        return newElement;
    };

    const previousElement = previousPart ? createElement(previousPart) : null;
    const selectedElement = createElement(theSelectedPart);
    const nextElement = nextPart ? createElement(nextPart) : null;

    element.after(selectedElement);
    if (previousElement) selectedElement.before(previousElement);
    if (nextElement) selectedElement.after(nextElement);
    
    element.remove();

    return selectedElement;
};

export default splitHTMLElement;
