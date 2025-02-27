import { SelectedTextProps } from "@/components/EditorContainer";
import wrapSelectedText from "@/utils/wrapSelectedText";
import mergingSameClassesElements from "@/utils/mergingSameClassesElements";
import disassembleElement from "@/utils/dissembleElements";
import restoreSelection from "@/utils/restoreSelection";
import multipleApplyStyle from "@/utils/multipleApplyStyle";


const applyStyle = (
  style: string,
  isApplied: boolean,
  selectedText: SelectedTextProps | null
) => {
  // if no element was selected
  if (!selectedText) return;

  // we cant applt styles for CODE tag
  if (selectedText.fromTextNode?.node.parentElement?.tagName === "CODE") return;

  // check for multiple selection
  const isMultiple: boolean | undefined = selectedText?.multipleNodes;
  if (isMultiple) {
    multipleApplyStyle(style, isApplied, selectedText);
    return;
  }

  // if we did select nothing, just set pointer
  if (selectedText.fromTextNode?.startIndex === selectedText.fromTextNode?.endIndex) return;

  // ignore the eslint errors
  if(!selectedText.fromTextNode) return

  const { node, startIndex, endIndex } = selectedText.fromTextNode;
  const selectedElement: HTMLElement = node.parentElement as HTMLElement;

  // count the selected letters and length of the content
  const countOfLettersSelected = endIndex - startIndex;
  const contentOfSelectedElement = selectedElement.textContent as string;

  // grab the tag to apply
  const tagName = "span"

  // if we have styles we remove them
  if (isApplied) {
    if (contentOfSelectedElement.length !== countOfLettersSelected) {
      disassembleElement(selectedElement, startIndex, endIndex, style, isApplied, tagName);
      return;
    }

    selectedElement.classList.remove(style);
    if (tagName === "span" && !selectedElement.classList.length) {
      const newTextNode: Node = document.createTextNode(node.textContent as string);
      selectedElement.parentElement?.replaceChild(newTextNode, selectedElement);
      restoreSelection(newTextNode, startIndex, endIndex);
      selectedElement.parentElement?.normalize();
      return;
    }

    mergingSameClassesElements(selectedElement);
    return;
  } // otherwise we add styles

  // prevent eslint arguings
  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent) return;

  // if element has styles already we just add one more to the element
  if (selectedElement.classList.length) {
    if (contentOfSelectedElement.length !== countOfLettersSelected) {
      disassembleElement(node, startIndex, endIndex, style, isApplied, tagName);
      return;
    }
    selectedElement.classList.add(style);
    mergingSameClassesElements(selectedElement);
    return;
  }

  // if the element tag is everything except from span we dont wrap it
  if(tagName !== "span")
  {
    selectedElement.classList.add(style)
    return
  }


  // wrap the element with span tag
  const wrappedTextNode = wrapSelectedText(node, startIndex, endIndex, style);
  if (!wrappedTextNode) return;
  mergingSameClassesElements(wrappedTextNode.parentElement as HTMLElement);
};

export default applyStyle;
