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
  if (!selectedText) return;

  if (selectedText.fromTextNode?.node.parentElement?.tagName === "CODE") return;

  const isMultiple: boolean | undefined = selectedText?.multipleNodes;
  if (isMultiple) {
    multipleApplyStyle(style, isApplied, selectedText);
    return;
  }

  if (selectedText.fromTextNode?.startIndex === selectedText.fromTextNode?.endIndex) return;

  const { node, startIndex, endIndex } = selectedText.fromTextNode;
  const selectedElement: HTMLElement = node.parentElement as HTMLElement;

  const countOfLettersSelected = endIndex - startIndex;
  const contentOfSelectedElement = selectedElement.textContent as string;

  if (isApplied) {
    if (contentOfSelectedElement.length !== countOfLettersSelected) {
      disassembleElement(selectedElement, startIndex, endIndex, style, isApplied, "span");
      return;
    }

    selectedElement.classList.remove(style);
    if (!selectedElement.classList.length) {
      const newTextNode: Node = document.createTextNode(node.textContent as string);
      selectedElement.parentElement?.replaceChild(newTextNode, selectedElement);
      restoreSelection(newTextNode, startIndex, endIndex);
      selectedElement.parentElement?.normalize();
      return;
    }

    mergingSameClassesElements(selectedElement);
    return;
  }

  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent) return;

  if (selectedElement.classList.length) {
    if (contentOfSelectedElement.length !== countOfLettersSelected) {
      disassembleElement(node, startIndex, endIndex, style, isApplied, "span");
      return;
    }
    selectedElement.classList.add(style);
    mergingSameClassesElements(selectedElement);
    return;
  }

  const wrappedTextNode = wrapSelectedText(node, startIndex, endIndex, style);
  if (!wrappedTextNode) return;
  mergingSameClassesElements(wrappedTextNode.parentElement as HTMLElement);
};

export default applyStyle;
