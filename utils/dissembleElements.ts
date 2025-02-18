import getTextNode from "./getTextNode"
import mergingSameClassesElements from "./mergingSameClassesElements"
import { restoreSelection } from "./restoreSelection"

const disassembleElement = (element:HTMLElement | Text, startIndex:number, endIndex:number, className:string, isAppliedStyle:boolean, withTag:string)=>{

    if (!element.isConnected) {
        console.warn("Element is not in the DOM, skipping.");
        return;
    }

    const isTextNode = element.nodeType === 3


    // we rememeber the parts divided
    const previousPart:string = element.textContent.slice(0, startIndex)
    const theSelectedPart:string = element.textContent.slice(startIndex, endIndex)
    const nextPart:string = element.textContent.slice(endIndex, element.textContent.length)

    // take the styles for sides elements
    const sideStyles:string[] = isTextNode ? Array.from(element.parentElement.classList).sort() : Array.from(element.classList).sort()

    // declare the previous element with styles and remembered part
    const previousElement:HTMLSpanElement = isTextNode ? document.createTextNode('') : document.createElement(element.tagName)
    if(!isTextNode) previousElement.classList.add(...sideStyles)
    previousElement.textContent = previousPart

    // declare the selected textNode
    let theSelectedElement:Text|HTMLSpanElement = document.createTextNode(theSelectedPart)

    // if it still has classes - we dont mind about text node and declare the span element
    if(isTextNode && !isAppliedStyle)
    {
        theSelectedElement = document.createElement(withTag)
        theSelectedElement.classList.add(className)
        theSelectedElement.textContent = theSelectedPart

    }

    if(!isTextNode && ((!isAppliedStyle && element.classList.length >= 1) || (isAppliedStyle && element.classList.length > 1)))
    {
        theSelectedElement = document.createElement(withTag)
        theSelectedElement.classList.add(...Array.from(element.classList).sort())
        theSelectedElement.textContent = theSelectedPart

        if(isAppliedStyle)
            theSelectedElement.classList.remove(className)
        else
            theSelectedElement.classList.add(className)
    }


    // declare the next element with styles and remembered part
    const nextElement:HTMLSpanElement = isTextNode ? document.createTextNode('') : document.createElement(element.tagName)
    if(!isTextNode) nextElement.classList.add(...sideStyles)
    nextElement.textContent = nextPart
    
    // after parent we push the previous part
    element.after(previousElement)
    // after the previous part we push the selected part
    previousElement.after(theSelectedElement)
    // after the selected part we push the next part
    theSelectedElement.after(nextElement)

    // if our previous part has spaces and no letters - we push these spaces in selected part and delete the next part as well
    if(previousElement.textContent && !previousElement.textContent.trim()){        
        theSelectedElement.textContent = previousElement.textContent + theSelectedElement.textContent
        previousElement.remove()
    }

    // now we declare textnode, start index and end index to restore selection
    const textNodeForSelection = theSelectedElement.nodeType === 3 ? theSelectedElement : getTextNode(theSelectedElement as HTMLElement, 0, theSelectedElement.textContent?.length) as Text
    const start = startIndex - previousElement.textContent.length
    const end = textNodeForSelection?.textContent?.length + endIndex - nextElement.textContent.length

    restoreSelection(textNodeForSelection as Node, start, end)

    // if our previous part is just empty - we delete it
    if(!previousElement.textContent) previousElement.remove()
    
    // we always delete the parent element
    element.remove()
    
    
    // if our next part has spaces and no letters - we push these spaces in selected part and delete the next part as well
    if(nextElement.textContent && !nextElement.textContent.trim()){
        
        theSelectedElement.textContent =  theSelectedElement.textContent + nextElement.textContent
        nextElement.remove()
    }

    // if our next part is just empty - we delete it
    if(!nextElement.textContent) nextElement.remove()


    // we try to merge sibling elements if it is possible
    const changedElementObj = theSelectedElement.nodeType !== Node.TEXT_NODE ? mergingSameClassesElements(theSelectedElement as HTMLElement):null

    return changedElementObj

}

export default disassembleElement