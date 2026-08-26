import React, { useRef } from "react";

export default function ListBlock({ attributes, onChange, isSelected, onConvertBlockType }) {
  const { listType = "unordered", ordered = false, items = [""], textColor = "#ffffff" } = attributes;
  const isOrdered = listType === "ordered" || ordered === true;
  const itemRefs = useRef([]);

  const cleanItems = Array.isArray(items) && items.length > 0 ? items : [""];

  const handleItemChange = (index, value) => {
    const updated = [...cleanItems];
    updated[index] = value;
    onChange({ items: updated });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const currentDomHtml = e.currentTarget.innerHTML || "";

      // Save current line typed HTML first, then insert a new empty list item right after it
      const updated = [...cleanItems];
      updated[index] = currentDomHtml;
      updated.splice(index + 1, 0, "");
      onChange({ items: updated });
      setTimeout(() => {
        if (itemRefs.current[index + 1]) {
          itemRefs.current[index + 1].focus();
        }
      }, 0);
    } else if (e.key === "Backspace") {
      e.stopPropagation();
      const currentVal = (e.currentTarget.innerText || "").trim();

      // If current list item line is empty: remove ONLY THIS ONE single line!
      if (!currentVal) {
        e.preventDefault();
        if (cleanItems.length > 1) {
          const updated = cleanItems.filter((_, i) => i !== index);
          onChange({ items: updated });
          setTimeout(() => {
            const targetIdx = Math.max(0, index - 1);
            if (itemRefs.current[targetIdx]) {
              const prevEl = itemRefs.current[targetIdx];
              prevEl.focus();
              try {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(prevEl);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              } catch (err) {}
            }
          }, 0);
        } else if (typeof onConvertBlockType === "function") {
          onConvertBlockType("paragraph", { content: "" });
        }
        return;
      }
    }
  };

  const Tag = isOrdered ? "ol" : "ul";

  return (
    <div className="w-full my-1 font-['Outfit'] select-text">
      <Tag
        className={`pl-6 space-y-1 text-base leading-normal ${
          isOrdered ? "list-decimal" : "list-disc"
        }`}
        style={{ color: textColor }}
      >
        {cleanItems.map((item, idx) => (
          <li key={idx} className="group/item relative">
            <span
              ref={(el) => (itemRefs.current[idx] = el)}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                cleanItems[idx] = e.currentTarget.innerHTML;
              }}
              onBlur={(e) => handleItemChange(idx, e.currentTarget.innerHTML)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="outline-none block w-full leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: item || "" }}
            />
          </li>
        ))}
      </Tag>
    </div>
  );
}
