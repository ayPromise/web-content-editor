import areArraysEqual from "./areArraysEqual"
import getTextNode from "./getTextNode"
import { restoreSelection } from "./restoreSelection"

 const mergingSameClassesElements = (fromElement: HTMLElement) => {

        const previousSibling : HTMLElement|null = fromElement?.previousSibling && fromElement.previousSibling?.nodeType !== Node.TEXT_NODE ? fromElement.previousSibling as HTMLElement : null
        const nextSibling: HTMLElement|null = fromElement?.nextSibling && fromElement.nextSibling?.nodeType !== Node.TEXT_NODE ? fromElement.nextSibling as HTMLElement : null

        const appliedStylesToSelectedNode:string[] = Array.from(fromElement.classList).sort()
        const previousSiblingStyles:string[]|null = previousSibling ? Array.from(previousSibling.classList).sort() : null
        const nextSiblingStyles:string[]|null = nextSibling  ? Array.from(nextSibling.classList).sort() : null


        if(previousSibling && nextSibling && areArraysEqual(previousSiblingStyles, nextSiblingStyles) && areArraysEqual(previousSiblingStyles, appliedStylesToSelectedNode)){
                // we must merge the all three elements in one
                fromElement.insertAdjacentHTML('afterbegin', previousSibling.innerHTML)
                fromElement.insertAdjacentHTML('beforeend', nextSibling.innerHTML)
                fromElement.normalize()
                previousSibling.remove()
                nextSibling.remove()

                // after manipulating with DOM the selection resets so we must bring it back
                const text = getTextNode(fromElement, 0, fromElement.textContent?.length) as Node
                const start = previousSibling.innerHTML.length
                const end = fromElement.innerHTML.length - nextSibling.innerHTML.length
                if(text) restoreSelection(text, start, end)
                return {fromElement:text, startIndex:start, endIndex:end}
        }
        else if(previousSibling && areArraysEqual(previousSiblingStyles, appliedStylesToSelectedNode))
        {
                // we must merge with the previous sibling
                fromElement.insertAdjacentHTML('afterbegin', previousSibling.innerHTML)
                fromElement.normalize()
                previousSibling.remove()

                // after manipulating with DOM the selection resets so we must bring it back
                const text = getTextNode(fromElement, 0, fromElement.textContent?.length) as Node
                const start = previousSibling.innerHTML.length
                const end = fromElement.innerHTML.length
                if(text) restoreSelection(text, start, end)
                return {fromElement:text, startIndex:start, endIndex:end}
        } else if(nextSibling && areArraysEqual(nextSiblingStyles, appliedStylesToSelectedNode))
        {
                // we must merge with the next sibling
                fromElement.insertAdjacentHTML('beforeend', nextSibling.innerHTML)
                fromElement.normalize()
                nextSibling.remove()

                // after manipulating with DOM the selection resets so we must bring it back
                const text = getTextNode(fromElement, 0, fromElement.textContent?.length) as Node
                const start = 0
                const end = fromElement.innerHTML.length - nextSibling.innerHTML.length
                if(text) restoreSelection(text, start, end)
                return {fromElement:text, startIndex:start, endIndex:end}
        }
        const text = getTextNode(fromElement, 0, fromElement.textContent?.length) as Node

        if(text) restoreSelection(text, 0, text.textContent?.length)
        
        return {fromElement:text, startIndex:0, endIndex:text?.textContent?.length}
}

export default mergingSameClassesElements