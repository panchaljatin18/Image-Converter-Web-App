import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function ListBlock({ attributes, onChange, isSelected }) {
  const { listType = "unordered", items = ["First list item"], textColor = "#ffffff" } = attributes;

  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange({ items: updated });
  };

  const handleAddItem = () => {
    onChange({ items: [...items, "New list item"] });
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChange({ items: updated });
  };

  const Tag = listType === "ordered" ? "ol" : "ul";

  return (
    <div className="w-full my-2">
      <Tag className={`pl-6 space-y-1.5 text-sm ${listType === "ordered" ? "list-decimal" : "list-disc"}`} style={{ color: textColor }}>
        {items.map((item, idx) => (
          <li key={idx} className="group/item relative">
            <div className="flex items-center gap-2">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemChange(idx, e.currentTarget.innerHTML)}
                className="outline-none flex-1 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item }}
              />
              {isSelected && items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="opacity-0 group-hover/item:opacity-100 text-rose-400 hover:text-rose-300 p-1 rounded cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </li>
        ))}
      </Tag>
      {isSelected && (
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={13} /> Add item
        </button>
      )}
    </div>
  );
}
