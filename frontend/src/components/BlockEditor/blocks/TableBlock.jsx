import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Table as TableIcon,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Check,
} from "lucide-react";

export default function TableBlock({
  attributes = {},
  onChange,
  isSelected,
  onSelect,
}) {
  const {
    hasHeader = true,
    hasFooter = false,
    striped = true,
    head = ["Column 1", "Column 2", "Column 3"],
    rows = [
      ["Item 1", "Description 1", "Value 1"],
      ["Item 2", "Description 2", "Value 2"],
    ],
    foot = [],
  } = attributes;

  const [activeCell, setActiveCell] = useState(null); // { section: 'head'|'rows'|'foot', rowIndex: number, colIndex: number }
  const [showTableMenu, setShowTableMenu] = useState(false);
  const tableContainerRef = useRef(null);

  const colCount = Math.max(
    head.length,
    rows[0]?.length || 0,
    foot.length,
    1
  );

  // Helper to safely get cell element
  const getCellElement = (section, rowIndex, colIndex) => {
    if (!tableContainerRef.current) return null;
    return tableContainerRef.current.querySelector(
      `[data-section="${section}"][data-row="${rowIndex}"][data-col="${colIndex}"]`
    );
  };

  const focusCell = (section, rowIndex, colIndex) => {
    setTimeout(() => {
      const el = getCellElement(section, rowIndex, colIndex);
      if (el) {
        el.focus();
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 10);
  };

  // Cell Content Update
  const handleCellChange = (section, rowIndex, colIndex, value) => {
    if (section === "head") {
      const newHead = [...head];
      while (newHead.length < colCount) newHead.push("");
      newHead[colIndex] = value;
      onChange({ head: newHead });
    } else if (section === "rows") {
      const newRows = rows.map((r) => [...r]);
      if (!newRows[rowIndex]) newRows[rowIndex] = Array(colCount).fill("");
      while (newRows[rowIndex].length < colCount) newRows[rowIndex].push("");
      newRows[rowIndex][colIndex] = value;
      onChange({ rows: newRows });
    } else if (section === "foot") {
      const newFoot = [...foot];
      while (newFoot.length < colCount) newFoot.push("");
      newFoot[colIndex] = value;
      onChange({ foot: newFoot });
    }
  };

  // Keyboard navigation between cells (Tab, Shift+Tab)
  const handleCellKeyDown = (e, section, rowIndex, colIndex) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (!e.shiftKey) {
        // Move Forward
        if (section === "head") {
          if (colIndex < colCount - 1) {
            focusCell("head", 0, colIndex + 1);
          } else if (rows.length > 0) {
            focusCell("rows", 0, 0);
          } else if (hasFooter) {
            focusCell("foot", 0, 0);
          }
        } else if (section === "rows") {
          if (colIndex < colCount - 1) {
            focusCell("rows", rowIndex, colIndex + 1);
          } else if (rowIndex < rows.length - 1) {
            focusCell("rows", rowIndex + 1, 0);
          } else {
            // Reached last cell of table! Add new row automatically
            const newRow = Array(colCount).fill("");
            const newRows = [...rows, newRow];
            onChange({ rows: newRows });
            focusCell("rows", rows.length, 0);
          }
        } else if (section === "foot") {
          if (colIndex < colCount - 1) {
            focusCell("foot", 0, colIndex + 1);
          }
        }
      } else {
        // Move Backward (Shift + Tab)
        if (section === "foot") {
          if (colIndex > 0) {
            focusCell("foot", 0, colIndex - 1);
          } else if (rows.length > 0) {
            focusCell("rows", rows.length - 1, colCount - 1);
          } else if (hasHeader) {
            focusCell("head", 0, colCount - 1);
          }
        } else if (section === "rows") {
          if (colIndex > 0) {
            focusCell("rows", rowIndex, colIndex - 1);
          } else if (rowIndex > 0) {
            focusCell("rows", rowIndex - 1, colCount - 1);
          } else if (hasHeader) {
            focusCell("head", 0, colCount - 1);
          }
        } else if (section === "head") {
          if (colIndex > 0) {
            focusCell("head", 0, colIndex - 1);
          }
        }
      }
    }
  };

  // Row Manipulation
  const handleAddRow = (position = "below") => {
    const curRow = activeCell?.section === "rows" ? activeCell.rowIndex : rows.length - 1;
    const insertIdx = position === "above" ? Math.max(0, curRow) : curRow + 1;
    const newRow = Array(colCount).fill("");
    const newRows = [...rows];
    newRows.splice(insertIdx, 0, newRow);
    onChange({ rows: newRows });
    focusCell("rows", insertIdx, activeCell?.colIndex || 0);
  };

  const handleDeleteRow = () => {
    if (rows.length <= 1) return;
    const curRow = activeCell?.section === "rows" ? activeCell.rowIndex : rows.length - 1;
    const newRows = rows.filter((_, idx) => idx !== curRow);
    onChange({ rows: newRows });
    const targetRow = Math.min(curRow, newRows.length - 1);
    focusCell("rows", targetRow, activeCell?.colIndex || 0);
  };

  // Column Manipulation
  const handleAddColumn = (position = "right") => {
    const curCol = activeCell ? activeCell.colIndex : colCount - 1;
    const insertIdx = position === "left" ? Math.max(0, curCol) : curCol + 1;

    // Update head
    const newHead = [...head];
    while (newHead.length < colCount) newHead.push("");
    newHead.splice(insertIdx, 0, `Column ${insertIdx + 1}`);

    // Update rows
    const newRows = rows.map((row) => {
      const r = [...row];
      while (r.length < colCount) r.push("");
      r.splice(insertIdx, 0, "");
      return r;
    });

    // Update foot
    const newFoot = [...foot];
    if (hasFooter) {
      while (newFoot.length < colCount) newFoot.push("");
      newFoot.splice(insertIdx, 0, "");
    }

    onChange({
      head: newHead,
      rows: newRows,
      foot: newFoot,
    });
    focusCell(activeCell?.section || "head", activeCell?.rowIndex || 0, insertIdx);
  };

  const handleDeleteColumn = () => {
    if (colCount <= 1) return;
    const curCol = activeCell ? activeCell.colIndex : colCount - 1;

    const newHead = head.filter((_, idx) => idx !== curCol);
    const newRows = rows.map((row) => row.filter((_, idx) => idx !== curCol));
    const newFoot = foot.filter((_, idx) => idx !== curCol);

    onChange({
      head: newHead,
      rows: newRows,
      foot: newFoot,
    });
    const targetCol = Math.min(curCol, newHead.length - 1);
    focusCell(activeCell?.section || "head", activeCell?.rowIndex || 0, targetCol);
  };

  // Section Toggles
  const handleToggleHeader = () => {
    if (!hasHeader) {
      const newHead = Array(colCount)
        .fill("")
        .map((_, i) => head[i] || `Column ${i + 1}`);
      onChange({ hasHeader: true, head: newHead });
    } else {
      onChange({ hasHeader: false });
    }
  };

  const handleToggleFooter = () => {
    if (!hasFooter) {
      const newFoot = Array(colCount)
        .fill("")
        .map((_, i) => foot[i] || "");
      onChange({ hasFooter: true, foot: newFoot });
    } else {
      onChange({ hasFooter: false });
    }
  };

  const handleToggleStriped = () => {
    onChange({ striped: !striped });
  };

  return (
    <div
      ref={tableContainerRef}
      onClick={onSelect}
      className={`relative my-4 rounded-2xl border transition-all duration-200 ${
        isSelected
          ? "border-indigo-500/50 bg-[#12121e] shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/30"
          : "border-white/10 bg-[#0f0f1a] hover:border-white/20"
      }`}
    >
      {/* Table Control Header Bar (Shown when selected) */}
      {isSelected && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#171728] border-b border-white/10 rounded-t-2xl select-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 font-['Outfit']">
              <TableIcon size={14} /> Table
            </span>
            <span className="text-[11px] text-gray-400">
              {rows.length} {rows.length === 1 ? "row" : "rows"} × {colCount} {colCount === 1 ? "column" : "columns"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Add Row Above */}
            <button
              type="button"
              onClick={() => handleAddRow("above")}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Add Row Above"
            >
              <ArrowUp size={12} /> Row Above
            </button>

            {/* Add Row Below */}
            <button
              type="button"
              onClick={() => handleAddRow("below")}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Add Row Below"
            >
              <ArrowDown size={12} /> Row Below
            </button>

            {/* Add Column Left */}
            <button
              type="button"
              onClick={() => handleAddColumn("left")}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Add Column Left"
            >
              <ArrowLeft size={12} /> Col Left
            </button>

            {/* Add Column Right */}
            <button
              type="button"
              onClick={() => handleAddColumn("right")}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Add Column Right"
            >
              <ArrowRight size={12} /> Col Right
            </button>

            <div className="w-px h-4 bg-white/10 mx-0.5" />

            {/* Delete Row */}
            <button
              type="button"
              onClick={handleDeleteRow}
              disabled={rows.length <= 1}
              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-30 text-rose-400 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Delete Row"
            >
              <Trash2 size={12} /> Row
            </button>

            {/* Delete Column */}
            <button
              type="button"
              onClick={handleDeleteColumn}
              disabled={colCount <= 1}
              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-30 text-rose-400 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Delete Column"
            >
              <Trash2 size={12} /> Col
            </button>

            <div className="w-px h-4 bg-white/10 mx-0.5" />

            {/* Settings Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTableMenu(!showTableMenu)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  showTableMenu
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                }`}
              >
                <Sliders size={12} /> Settings <ChevronDown size={11} />
              </button>

              {showTableMenu && (
                <div className="absolute right-0 top-full mt-1.5 z-50 bg-[#161626] border border-white/15 rounded-xl p-2 shadow-2xl min-w-[190px] font-['Outfit'] space-y-1">
                  <button
                    type="button"
                    onClick={handleToggleHeader}
                    className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Header Section</span>
                    {hasHeader && <Check size={14} className="text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleFooter}
                    className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Footer Section</span>
                    {hasFooter && <Check size={14} className="text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleStriped}
                    className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Striped Rows</span>
                    {striped && <Check size={14} className="text-indigo-400" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Canvas with Responsive Scroll */}
      <div className="overflow-x-auto p-3">
        <table className="w-full border-collapse text-left text-sm text-gray-200">
          {/* Table Header */}
          {hasHeader && (
            <thead>
              <tr className="border-b-2 border-indigo-500/30 bg-[#171728]/80 text-xs font-bold text-indigo-200 tracking-wider">
                {Array(colCount)
                  .fill(null)
                  .map((_, colIdx) => (
                    <th
                      key={`th-${colIdx}`}
                      data-section="head"
                      data-row={0}
                      data-col={colIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() =>
                        setActiveCell({ section: "head", rowIndex: 0, colIndex: colIdx })
                      }
                      onBlur={(e) =>
                        handleCellChange("head", 0, colIdx, e.currentTarget.innerHTML)
                      }
                      onKeyDown={(e) => handleCellKeyDown(e, "head", 0, colIdx)}
                      dangerouslySetInnerHTML={{ __html: head[colIdx] || "" }}
                      className="p-3 border border-white/10 outline-none focus:bg-indigo-600/20 focus:ring-1 focus:ring-indigo-400 min-w-[120px] transition-colors"
                      placeholder={`Header ${colIdx + 1}`}
                    />
                  ))}
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={`tr-${rowIdx}`}
                className={`border-b border-white/5 transition-colors ${
                  striped && rowIdx % 2 === 1
                    ? "bg-[#141424]/60"
                    : "bg-transparent"
                } hover:bg-indigo-500/5`}
              >
                {Array(colCount)
                  .fill(null)
                  .map((_, colIdx) => (
                    <td
                      key={`td-${rowIdx}-${colIdx}`}
                      data-section="rows"
                      data-row={rowIdx}
                      data-col={colIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() =>
                        setActiveCell({ section: "rows", rowIndex: rowIdx, colIndex: colIdx })
                      }
                      onBlur={(e) =>
                        handleCellChange("rows", rowIdx, colIdx, e.currentTarget.innerHTML)
                      }
                      onKeyDown={(e) => handleCellKeyDown(e, "rows", rowIdx, colIdx)}
                      dangerouslySetInnerHTML={{ __html: row[colIdx] || "" }}
                      className="p-3 border border-white/10 outline-none focus:bg-indigo-600/20 focus:ring-1 focus:ring-indigo-400 min-w-[120px] transition-colors text-xs text-gray-300"
                      placeholder="..."
                    />
                  ))}
              </tr>
            ))}
          </tbody>

          {/* Table Footer */}
          {hasFooter && (
            <tfoot>
              <tr className="border-t-2 border-indigo-500/30 bg-[#171728]/80 text-xs font-semibold text-indigo-300">
                {Array(colCount)
                  .fill(null)
                  .map((_, colIdx) => (
                    <td
                      key={`tf-${colIdx}`}
                      data-section="foot"
                      data-row={0}
                      data-col={colIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() =>
                        setActiveCell({ section: "foot", rowIndex: 0, colIndex: colIdx })
                      }
                      onBlur={(e) =>
                        handleCellChange("foot", 0, colIdx, e.currentTarget.innerHTML)
                      }
                      onKeyDown={(e) => handleCellKeyDown(e, "foot", 0, colIdx)}
                      dangerouslySetInnerHTML={{ __html: foot[colIdx] || "" }}
                      className="p-3 border border-white/10 outline-none focus:bg-indigo-600/20 focus:ring-1 focus:ring-indigo-400 min-w-[120px] transition-colors"
                      placeholder={`Footer ${colIdx + 1}`}
                    />
                  ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
