import { useEffect, useState } from "react";
import checkSelectedStyle from "@/utils/checkSelectedStyle";
import { SelectedTextProps } from "@/components/EditorContainer";

export interface StylingStateProps {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
  code: boolean;
  linkURL: string;
}

const useTextStyling = (selectedText: SelectedTextProps | null) => {
  const [stylingState, setStylingState] = useState<StylingStateProps>({
    bold: false,
    italic: false,
    underline: false,
    lineThrough: false,
    code: false,
    linkURL: "",
  });

  useEffect(() => {
    if (!selectedText) return;

    const selectedElement = selectedText.fromTextNode?.node.parentElement as HTMLElement;
    const orderedList = selectedText?.orderedNodes;

    const { bold, italic, underline, lineThrough, linkURL } = checkSelectedStyle(selectedElement, orderedList);

    setStylingState((prev) => ({
      ...prev,
      bold,
      italic,
      underline,
      lineThrough,
      linkURL
    }));
  }, [selectedText]);

  return { stylingState, setStylingState };
};

export default useTextStyling;
