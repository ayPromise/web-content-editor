import { SelectedTextProps } from "@/components/EditorContainer";
import disassembleElement from "./dissembleElements";
import restoreSelection from "./restoreSelection";
import restoreSelectionForMultipleNodes from "./restoreSelectionForMultipleNodes";

const multipleApplyStyle = (style: string, isApplied: boolean, selectedText:SelectedTextProps) => {

        // nothing to deal with no array
        if (!selectedText?.orderedNodes?.length) return

        const { orderedNodes } = selectedText

        // stores future ready elements
        const disassembledArray: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        }[] = []


        orderedNodes.forEach((nodeObject) => {

            // we dont apply styles on CODE elements
            if (nodeObject.node.parentElement?.tagName === "CODE") return

            let currentElement: HTMLElement = nodeObject.node

            // take the last element before <p>
            if (currentElement.parentElement.parentElement && currentElement.parentElement.parentElement.id !== 'editor')
                currentElement = currentElement.parentElement

            // disassemble the element
            const elementObj: {
                fromElement: Node;
                startIndex: number;
                endIndex: number | undefined;
            } = disassembleElement(currentElement, nodeObject.startIndex, nodeObject.endIndex, style, isApplied, 'span')

            disassembledArray.push(elementObj)
        })

        // stores the first element to select
        let first: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        } | null = null

        // stores the last element to select
        let last: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        } | null = null

        for (let i = 0; i < disassembledArray.length; i++) {
            // we need only elements that still exist after normalizing and merging
            if (disassembledArray[i] && disassembledArray[i].fromElement.isConnected) {

                // if we still dont get the first - it gets the value the first number
                if (!first) {
                    first = disassembledArray[i]
                } else
                    // then only last 
                    last = disassembledArray[i]
            }
        }

        // if we got not elements to select - that means something went wrong TURN OFF COMPUTER
        if (!first && !last) return



        // select only one element if another one is not presented
        if (!last) {
            restoreSelection(first.fromElement, 0, first.fromElement.textContent?.length)
            return
        }

        if (!first) {
            restoreSelection(last.fromElement, 0, last.fromElement.textContent?.length)
            return
        }

        if (!isApplied) {
            // if we took element on parts by removing class we select all letter
            restoreSelectionForMultipleNodes(first.fromElement, last.fromElement, 0, last.fromElement.textContent?.length as number)
        } else {
            // if we build element in one piece by adding class we select letter from startIndex and lastIndex
            restoreSelectionForMultipleNodes(first.fromElement, last.fromElement, first.startIndex, last.endIndex as number)
        }

    }

    export default multipleApplyStyle