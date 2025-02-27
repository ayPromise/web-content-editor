import { StylingStateProps } from "@/hooks/useTextStyling";

// Припустимо, що SelectedNode виглядає приблизно так:
export interface SelectedNode {
  node: { parentElement: HTMLElement | null };
}

const checkSelectedStyle = (
  element?: HTMLElement | null,
  listOfElements?: SelectedNode[]
): StylingStateProps => {
  const result: StylingStateProps = { bold: false, italic: false, underline: false, lineThrough:false, code:false, linkURL:'' };

  const styles = [
    { className: "font-bold", key: "bold" },
    { className: "italic", key: "italic" },
    { className: "underline", key: "underline" },
    { className:"line-through", key:"lineThrough"}
  ];


 if (listOfElements && listOfElements.length > 0) 
  {
    // check for styles in a row of element
    styles.forEach(({ className, key }) => {
      result[key] = listOfElements.every(
        el => el.node.parentElement?.classList?.contains(className));
    });

    for (const el of listOfElements) {
      const anchor = el.node.parentElement.closest("a");
      
      if (!anchor) {
          result.linkURL = '';
          return result;
      }

      result.linkURL = anchor.getAttribute("href")
    }
  } else if (element) {
    // check for style in a single element
    styles.forEach(({ className, key }) => {
      result[key] = element.classList?.contains(className) ?? false;
    });

    const anchor = element.closest("a");
    if(anchor)
      result.linkURL = anchor.getAttribute("href")


  }

  return result;

};

export default checkSelectedStyle;
