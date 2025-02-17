interface ReturnType {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
}

// Припустимо, що SelectedNode виглядає приблизно так:
export interface SelectedNode {
  node: { parentElement: HTMLElement | null };
}

const checkSelectedStyle = (
  element?: HTMLElement | null,
  listOfElements?: SelectedNode[]
): ReturnType => {
  const result: ReturnType = { bold: false, italic: false, underline: false, lineThrough:false };

  const styles = [
    { className: "font-bold", key: "bold" },
    { className: "italic", key: "italic" },
    { className: "underline", key: "underline" },
    { className:"line-through", key:"lineThrough"}
  ];

 if (listOfElements && listOfElements.length > 0) {
    // Якщо передано список, перевіряємо, чи всі вузли мають потрібний клас
    styles.forEach(({ className, key }) => {
      result[key] = listOfElements.every(
        el => el.node.parentElement?.classList?.contains(className));
    });
  } else if (element) {
    // Інакше перевіряємо тільки один елемент
    styles.forEach(({ className, key }) => {
      result[key] = element.classList?.contains(className) ?? false;
    });
  }

  return result;
};

export default checkSelectedStyle;
