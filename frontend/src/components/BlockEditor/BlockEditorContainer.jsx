import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Layers,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Save,
  Send,
  Eye,
  Loader2,
  Slash,
  HelpCircle,
  Keyboard,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { createBlock, generateBlockId, BLOCK_DEFINITIONS, normalizeBlock, normalizeBlockState } from "./utils/blockTypes";
import { blocksToHtml, htmlToBlocks } from "./utils/serializer";
import "@/app/blog/prose.css";

import ParagraphBlock from "./blocks/ParagraphBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import ImageBlock from "./blocks/ImageBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import ListBlock from "./blocks/ListBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import ButtonBlock from "./blocks/ButtonBlock";
import ColumnsBlock from "./blocks/ColumnsBlock";
import CodeBlock from "./blocks/CodeBlock";
import CustomHtmlBlock from "./blocks/CustomHtmlBlock";
import EmbedBlock from "./blocks/EmbedBlock";
import DividerBlock from "./blocks/DividerBlock";

import BlockToolbar from "./BlockToolbar";
import BlockInserter from "./BlockInserter";
import BlockOutlineDrawer from "./BlockOutlineDrawer";
import BlockInspectorSidebar from "./BlockInspectorSidebar";

import SlashMenuPopover, { SLASH_COMMANDS } from "./SlashMenuPopover";

const ensureUniqueBlockIds = (blockList = []) => {
  if (!Array.isArray(blockList)) return [];
  const seen = new Set();
  return blockList.map((b) => {
    let id = b.id || generateBlockId();
    if (seen.has(id)) {
      id = generateBlockId();
    }
    seen.add(id);
    return { ...b, id };
  });
};

const deviceWidths = {
  desktop: "max-w-[780px]",
  tablet: "max-w-[640px]",
  mobile: "max-w-[380px]",
};

export default function BlockEditorContainer({
  initialHtml = "",
  initialBlocks = null,
  onSave,
  onBlocksChange,
  saving = false,
  // Document level props
  postTitle = "",
  setPostTitle,
  postSlug = "",
  setPostSlug,
  postStatus = "Draft",
  setPostStatus,
  description = "",
  setDescription,
  focusKeyword = "",
  setFocusKeyword,
  tags = "",
  setTags,
  coverImage = "",
  setCoverImage,
  imageAlt = "",
  setImageAlt,
  imageTitle = "",
  setImageTitle,
  onOpenMediaModal,
}) {
  // State for Blocks Array (Structured Block representation as source of truth)
  const [blocks, setBlocks] = useState(() => {
    if (initialBlocks) {
      const norm = normalizeBlockState(initialBlocks);
      if (norm.blocks.length > 0) {
        return ensureUniqueBlockIds(norm.blocks);
      }
    }
    if (initialHtml && initialHtml.trim()) {
      return ensureUniqueBlockIds(htmlToBlocks(initialHtml));
    }
    return [createBlock("paragraph", { content: "" })];
  });

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const blocksContainerRef = useRef(null);
  const titleInputRef = useRef(null);
  const ctrlACountRef = useRef(0);
  const ctrlALastTimeRef = useRef(0);

  // Undo / Redo Stack
  const [history, setHistory] = useState([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // UI Modals / Panels
  const [isInserterOpen, setIsInserterOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [deviceMode, setDeviceMode] = useState("desktop"); // desktop, tablet, mobile
  const [insertIndex, setInsertIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Slash Command Menu
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashBlockId, setSlashBlockId] = useState(null);
  const [slashQuery, setSlashQuery] = useState(null);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  const handleSlashQuery = React.useCallback((blockId, query, pos) => {
    if (query !== null && pos !== null) {
      setSlashBlockId(blockId);
      setSlashQuery(query);
      setSlashPos(pos);
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
      setSlashQuery(null);
    }
  }, []);

  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (initialBlocks) {
      const norm = normalizeBlockState(initialBlocks);
      if (norm.blocks.length > 0) {
        const clean = ensureUniqueBlockIds(norm.blocks);
        setBlocks(clean);
        setHistory([clean]);
        setHistoryIndex(0);
        isLoadedRef.current = true;
        return;
      }
    }
    if (initialHtml && initialHtml.trim() && !isLoadedRef.current) {
      const parsed = ensureUniqueBlockIds(htmlToBlocks(initialHtml));
      setBlocks(parsed);
      setHistory([parsed]);
      setHistoryIndex(0);
      isLoadedRef.current = true;
    }
  }, [initialBlocks, initialHtml]);

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Global Keyboard Shortcuts (Official WordPress Gutenberg Standard)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (["INPUT", "TEXTAREA"].includes(activeEl.tagName) || activeEl.isContentEditable);
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Slash Menu Keyboard Controls
      if (showSlashMenu) {
        const filtered = SLASH_COMMANDS.filter((cmd) => {
          if (!slashQuery) return true;
          const q = slashQuery.toLowerCase().trim();
          return (
            cmd.id.startsWith(q) ||
            cmd.label.toLowerCase().includes(q) ||
            cmd.keywords.some((k) => k.startsWith(q))
          );
        });

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
          return;
        }

        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          if (filtered.length > 0 && filtered[slashSelectedIndex]) {
            handleSlashSelect(filtered[slashSelectedIndex]);
          }
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          setShowSlashMenu(false);
          return;
        }
      }

      // Multi-press Ctrl+A / Cmd+A Handler:
      // Press 1x -> Native block text selection
      // Press 3x -> Select all blog blocks across the entire blog canvas, excluding Main Heading (postTitle)
      if (isCmdOrCtrl && key === "a") {
        const isInsideTitle = activeEl && (activeEl === titleInputRef.current || titleInputRef.current?.contains(activeEl));
        const isInsideSidebar = activeEl && (activeEl.closest?.(".inspector-sidebar") || activeEl.closest?.("aside"));

        // If inside Main Heading input or sidebar, allow normal input select all
        if (isInsideTitle || isInsideSidebar) {
          ctrlACountRef.current = 0;
          return;
        }

        const now = Date.now();
        if (now - ctrlALastTimeRef.current < 2000) {
          ctrlACountRef.current += 1;
        } else {
          ctrlACountRef.current = 1;
        }
        ctrlALastTimeRef.current = now;

        if (ctrlACountRef.current >= 3) {
          e.preventDefault();
          e.stopPropagation();

          setIsAllSelected(true);
          setSelectedBlockId(null);

          if (activeEl && typeof activeEl.blur === "function") {
            activeEl.blur();
          }

          if (blocksContainerRef.current) {
            try {
              const range = document.createRange();
              range.selectNodeContents(blocksContainerRef.current);
              const sel = window.getSelection();
              if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
              }
            } catch (err) {
              console.warn("Error creating DOM selection across blocks:", err);
            }
          }
          return;
        }
        return;
      }

      // If user presses any non-modifier key, reset the Ctrl+A counter
      if (!isCmdOrCtrl && !["control", "meta", "alt", "shift"].includes(key)) {
        ctrlACountRef.current = 0;
      }

      // Handle actions when entire blog is selected (isAllSelected === true)
      if (isAllSelected) {
        // Backspace or Delete: Clears all blocks and creates a new empty paragraph block
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          const emptyBlock = createBlock("paragraph", { content: "" });
          updateBlocks([emptyBlock]);
          setSelectedBlockId(emptyBlock.id);
          setIsAllSelected(false);
          ctrlACountRef.current = 0;
          const sel = window.getSelection();
          if (sel) sel.removeAllRanges();
          return;
        }

        // Copy (Ctrl+C / Cmd+C): Native selection covers blocksContainerRef so browser copies cleanly
        if (isCmdOrCtrl && key === "c") {
          return;
        }

        // Printable key typed: Replace all blocks with typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          const newBlock = createBlock("paragraph", { content: e.key });
          updateBlocks([newBlock]);
          setSelectedBlockId(newBlock.id);
          setIsAllSelected(false);
          ctrlACountRef.current = 0;
          const sel = window.getSelection();
          if (sel) sel.removeAllRanges();
          return;
        }

        // Navigation or Escape keys: Deselect all blocks
        if (["escape", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
          setIsAllSelected(false);
          ctrlACountRef.current = 0;
          const sel = window.getSelection();
          if (sel) sel.removeAllRanges();
          if (key === "escape") return;
        }
      }

      // 1. Save Post: Ctrl + S / Cmd + S
      if (isCmdOrCtrl && key === "s") {
        e.preventDefault();
        const htmlOutput = blocksToHtml(blocks, { includeDelimiters: true });
        const structuredBlocks = {
          version: 1,
          blocks: blocks.map((b) => ({
            id: b.id,
            type: b.type === "custom-html" ? "html" : b.type,
            attrs: b.attrs || b.attributes || {},
            content: b.content !== undefined ? b.content : (b.attributes?.content || b.attributes?.html || b.attributes?.code || ""),
            children: b.children || [],
          })),
        };
        if (onSave) onSave(htmlOutput, structuredBlocks, postStatus);
        return;
      }

      // Link Insertion Popover: Ctrl + K / Cmd + K
      if (isCmdOrCtrl && key === "k") {
        e.preventDefault();
        const linkBtn = document.querySelector("button[data-action='link-btn']");
        if (linkBtn) {
          linkBtn.click();
        }
        return;
      }

      // 2. Undo: Ctrl + Z / Cmd + Z (without Shift/Alt)
      if (isCmdOrCtrl && key === "z" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // 3. Redo: Ctrl + Y / Cmd + Y OR Ctrl + Shift + Z / Cmd + Shift + Z
      if ((isCmdOrCtrl && key === "y") || (isCmdOrCtrl && e.shiftKey && key === "z")) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 4. Keyboard Shortcuts Help Modal: Shift + Alt + H OR Ctrl + Shift + ?
      if ((e.shiftKey && e.altKey && key === "h") || (isCmdOrCtrl && e.shiftKey && key === "/")) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
        return;
      }

      // 5. Toggle List View Outline: Ctrl + Shift + Alt + O
      if (isCmdOrCtrl && e.shiftKey && e.altKey && key === "o") {
        e.preventDefault();
        setIsOutlineOpen((prev) => !prev);
        return;
      }

      // 6. Escape: Deselect selected block and close all flyouts/modals
      if (e.key === "Escape") {
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (isInserterOpen) setIsInserterOpen(false);
        if (isOutlineOpen) setIsOutlineOpen(false);
        if (selectedBlockId) setSelectedBlockId(null);
        if (isAllSelected) {
          setIsAllSelected(false);
          ctrlACountRef.current = 0;
          const sel = window.getSelection();
          if (sel) sel.removeAllRanges();
        }
        return;
      }

      // 7. Duplicate Selected Block: Ctrl + Shift + D / Cmd + Shift + D
      if (isCmdOrCtrl && e.shiftKey && key === "d") {
        e.preventDefault();
        if (selectedBlockId) {
          const idx = blocks.findIndex((b) => b.id === selectedBlockId);
          if (idx !== -1) handleDuplicateBlock(idx);
        }
        return;
      }

      // 8. Delete / Remove Selected Block: Shift + Alt + Z OR Delete / Backspace (when not typing inside text input)
      if (
        (e.shiftKey && e.altKey && key === "z") ||
        (!isInput && !e.ctrlKey && !e.metaKey && (e.key === "Delete" || e.key === "Backspace"))
      ) {
        let targetId = selectedBlockId;
        if (!targetId && activeEl) {
          const blockEl = activeEl.closest ? activeEl.closest("[data-block-id]") : null;
          if (blockEl) targetId = blockEl.getAttribute("data-block-id");
        }
        if (targetId) {
          e.preventDefault();
          handleDeleteBlock(targetId);
          return;
        }
      }

      // 9. Move Block Up: Ctrl + Shift + Up / Cmd + Shift + Up
      if (isCmdOrCtrl && e.shiftKey && e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedBlockId) {
          const idx = blocks.findIndex((b) => b.id === selectedBlockId);
          if (idx > 0) handleMoveUp(idx);
        }
        return;
      }

      // 10. Move Block Down: Ctrl + Shift + Down / Cmd + Shift + Down
      if (isCmdOrCtrl && e.shiftKey && e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedBlockId) {
          const idx = blocks.findIndex((b) => b.id === selectedBlockId);
          if (idx !== -1 && idx < blocks.length - 1) handleMoveDown(idx);
        }
        return;
      }

      // 11. Insert Block BEFORE: Ctrl + Alt + T / Cmd + Option + T
      if (isCmdOrCtrl && e.altKey && key === "t") {
        e.preventDefault();
        const idx = selectedBlockId ? blocks.findIndex((b) => b.id === selectedBlockId) : 0;
        setInsertIndex(Math.max(0, idx));
        setIsInserterOpen(true);
        return;
      }

      // 12. Insert Block AFTER: Ctrl + Alt + Y / Cmd + Option + Y
      if (isCmdOrCtrl && e.altKey && key === "y") {
        e.preventDefault();
        const idx = selectedBlockId ? blocks.findIndex((b) => b.id === selectedBlockId) + 1 : blocks.length;
        setInsertIndex(idx);
        setIsInserterOpen(true);
        return;
      }

      // 13. Heading Level & Transform Shortcuts (Official WordPress Gutenberg Standard):
      // Shift + Alt + 1..6 -> H1..H6 | Shift + Alt + 0 -> Paragraph
      // Ctrl + Alt + 1..6 -> H1..H6 | Ctrl + Alt + 0 -> Paragraph
      if ((e.shiftKey && e.altKey) || (isCmdOrCtrl && e.altKey)) {
        let targetId = selectedBlockId;
        if (!targetId && activeEl) {
          const blockEl = activeEl.closest ? activeEl.closest("[data-block-id]") : null;
          if (blockEl) targetId = blockEl.getAttribute("data-block-id");
        }
        if (!targetId && blocks.length > 0) targetId = blocks[0].id;

        const code = e.code || "";
        const digitMatch = code.match(/^(?:Digit|Numpad)([0-6])$/);
        let level = digitMatch ? parseInt(digitMatch[1], 10) : null;

        if (level === null) {
          if (["0", ")"].includes(e.key)) level = 0;
          else if (["1", "!"].includes(e.key)) level = 1;
          else if (["2", "@"].includes(e.key)) level = 2;
          else if (["3", "#"].includes(e.key)) level = 3;
          else if (["4", "$"].includes(e.key)) level = 4;
          else if (["5", "%"].includes(e.key)) level = 5;
          else if (["6", "^"].includes(e.key)) level = 6;
        }

        // Shift + Alt + 0 / Ctrl + Alt + 0 / Shift + Alt + P -> Paragraph
        if (level === 0 || key === "p") {
          e.preventDefault();
          if (targetId) handleChangeBlockType(targetId, "paragraph");
          return;
        }

        // Shift + Alt + 1..6 / Ctrl + Alt + 1..6 -> Heading H1..H6
        if (level !== null && level >= 1 && level <= 6) {
          e.preventDefault();
          if (targetId) handleChangeBlockType(targetId, "heading", { level });
          return;
        }

        // Transform to Heading H2: Shift + Alt + H / Ctrl + Alt + H
        if (key === "h" && !e.shiftKey) {
          e.preventDefault();
          if (targetId) handleChangeBlockType(targetId, "heading", { level: 2 });
          return;
        }

        // Transform to Code: Ctrl + Alt + C / Shift + Alt + C
        if (key === "c") {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) handleChangeBlockType(targetId, "code");
          return;
        }

        // Transform to Quote: Ctrl + Alt + Q / Shift + Alt + Q
        if (key === "q") {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) handleChangeBlockType(targetId, "quote");
          return;
        }

        // Transform to List: Ctrl + Alt + U / Shift + Alt + U
        if (key === "u") {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) handleChangeBlockType(targetId, "list", { ordered: false });
          return;
        }

        // Transform to Custom HTML: Ctrl + Alt + K / Shift + Alt + K
        if (key === "k") {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) handleChangeBlockType(targetId, "custom-html");
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blocks, selectedBlockId, historyIndex, history, onSave, postStatus, showShortcutsModal, isInserterOpen, isOutlineOpen, isAllSelected]);

  // Update blocks with history tracking (limit history stack size to 100 for memory optimization)
  const updateBlocks = React.useCallback((newBlocks) => {
    const cleanBlocks = ensureUniqueBlockIds(newBlocks);
    setBlocks(cleanBlocks);
    setHistory((prevHistory) => {
      const sliced = prevHistory.slice(0, historyIndex + 1);
      if (sliced.length >= 100) sliced.shift();
      const nextHistory = [...sliced, cleanBlocks];
      setHistoryIndex(nextHistory.length - 1);
      return nextHistory;
    });
    if (onBlocksChange) {
      onBlocksChange(cleanBlocks);
    }
  }, [historyIndex, onBlocksChange]);

  const handleUndo = React.useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const targetBlocks = history[prevIdx];
      if (!targetBlocks) return;
      setHistoryIndex(prevIdx);
      setBlocks(targetBlocks);

      setTimeout(() => {
        const activeEl = typeof document !== "undefined" ? document.activeElement : null;
        if (activeEl && activeEl.isContentEditable) {
          const blockEl = activeEl.closest ? activeEl.closest("[data-block-id]") : null;
          if (blockEl) {
            const blockId = blockEl.getAttribute("data-block-id");
            const targetBlock = targetBlocks.find((b) => b.id === blockId);
            if (targetBlock) {
              const val = targetBlock.attributes?.content || "";
              activeEl.innerHTML = val;
              try {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(activeEl);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              } catch (err) {}
            }
          }
        }
      }, 0);
    }
  }, [history, historyIndex]);

  const handleRedo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const targetBlocks = history[nextIdx];
      if (!targetBlocks) return;
      setHistoryIndex(nextIdx);
      setBlocks(targetBlocks);

      setTimeout(() => {
        const activeEl = typeof document !== "undefined" ? document.activeElement : null;
        if (activeEl && activeEl.isContentEditable) {
          const blockEl = activeEl.closest ? activeEl.closest("[data-block-id]") : null;
          if (blockEl) {
            const blockId = blockEl.getAttribute("data-block-id");
            const targetBlock = targetBlocks.find((b) => b.id === blockId);
            if (targetBlock) {
              const val = targetBlock.attributes?.content || "";
              activeEl.innerHTML = val;
              try {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(activeEl);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              } catch (err) {}
            }
          }
        }
      }, 0);
    }
  }, [history, historyIndex]);

  // Add block at specific index or at the end
  const handleAddBlock = React.useCallback((type, targetIdx = null) => {
    const newBlock = createBlock(type);
    const idx = targetIdx !== null ? targetIdx : blocks.length;
    const updated = [...blocks];
    updated.splice(idx, 0, newBlock);
    updateBlocks(updated);
    setSelectedBlockId(newBlock.id);
  }, [blocks, updateBlocks]);

  const handleUpdateBlockAttributes = React.useCallback((blockId, newAttributes, newChildren = null) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        const mergedAttrs = { ...(b.attrs || b.attributes), ...newAttributes };
        let newContent = b.content;
        if (newAttributes.content !== undefined) newContent = newAttributes.content;
        else if (newAttributes.html !== undefined) newContent = newAttributes.html;
        else if (newAttributes.code !== undefined) newContent = newAttributes.code;

        return {
          ...b,
          attrs: mergedAttrs,
          attributes: mergedAttrs,
          content: newContent !== undefined ? newContent : b.content,
          ...(newChildren ? { children: newChildren } : {}),
        };
      }
      return b;
    });
    updateBlocks(updated);
  }, [blocks, updateBlocks]);

  const handleMoveUp = React.useCallback((index) => {
    if (index <= 0) return;
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updateBlocks(updated);
  }, [blocks, updateBlocks]);

  const handleMoveDown = React.useCallback((index) => {
    if (index >= blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updateBlocks(updated);
  }, [blocks, updateBlocks]);

  const handleDuplicateBlock = React.useCallback((index) => {
    const targetBlock = blocks[index];
    if (!targetBlock) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(targetBlock)),
      id: generateBlockId(),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    updateBlocks(updated);
    setSelectedBlockId(duplicated.id);
  }, [blocks, updateBlocks]);

  const handleDeleteBlock = React.useCallback((blockId) => {
    if (blocks.length <= 1) {
      const fallback = [createBlock("paragraph", { content: "" })];
      updateBlocks(fallback);
      setSelectedBlockId(fallback[0].id);
      return;
    }
    const updated = blocks.filter((b) => b.id !== blockId);
    updateBlocks(updated);
    setSelectedBlockId(null);
  }, [blocks, updateBlocks]);

  const handleChangeBlockType = React.useCallback((blockId, newType, extraAttrs = {}) => {
    const activeEl = typeof document !== "undefined" ? document.activeElement : null;
    let domContent = null;
    if (activeEl && activeEl.isContentEditable) {
      const blockEl = activeEl.closest ? activeEl.closest("[data-block-id]") : null;
      if (blockEl && blockEl.getAttribute("data-block-id") === blockId) {
        domContent = activeEl.innerHTML;
      }
    }

    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        const targetContent =
          (extraAttrs && typeof extraAttrs.content === "string" && extraAttrs.content.trim() !== "")
            ? extraAttrs.content
            : (domContent !== null && domContent.trim() !== "")
            ? domContent
            : (b.attributes?.content || "");

        let mergedAttrs = {
          ...b.attributes,
          ...extraAttrs,
          content: targetContent,
        };

        if (newType === "list") {
          let listItems = [""];
          if (targetContent && targetContent.trim()) {
            const lines = targetContent
              .split(/<br\s*\/?>|\n/gi)
              .map((l) => l.replace(/<[^>]*>/g, "").trim())
              .filter(Boolean);
            if (lines.length > 0) listItems = lines;
          }
          mergedAttrs = {
            ...mergedAttrs,
            items: (extraAttrs && Array.isArray(extraAttrs.items) && extraAttrs.items.length > 0)
              ? extraAttrs.items
              : listItems,
          };
        }

        return createBlock(newType, mergedAttrs, b.children, b.id);
      }
      return b;
    });
    updateBlocks(updated);
  }, [blocks, updateBlocks]);

  const [focusPosition, setFocusPosition] = useState("start");

  const handleEnterNextBlock = React.useCallback((index, initialContent = "") => {
    const newBlock = createBlock("paragraph", { content: initialContent });
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    updateBlocks(updated);
    setFocusPosition("start");
    setSelectedBlockId(newBlock.id);
  }, [blocks, updateBlocks]);

  const handleMergeWithPreviousBlock = React.useCallback((index, blockId, currentContent) => {
    if (index <= 0 || index >= blocks.length) return;
    const prevBlock = blocks[index - 1];
    const updated = [...blocks];

    const prevContent = prevBlock.attributes?.content || "";
    const mergedContent = prevContent + (currentContent || "");

    updated[index - 1] = {
      ...prevBlock,
      attributes: {
        ...prevBlock.attributes,
        content: mergedContent,
      },
    };

    updated.splice(index, 1);
    updateBlocks(updated);

    setFocusPosition("end");
    setSelectedBlockId(prevBlock.id);
  }, [blocks, updateBlocks]);

  const handleDeleteEmptyBlockOnBackspace = React.useCallback((index, blockId) => {
    if (blocks.length <= 1) return;
    const updated = blocks.filter((b) => b.id !== blockId);
    updateBlocks(updated);
    const prevIndex = Math.max(0, index - 1);
    if (blocks[prevIndex]) {
      setFocusPosition("end");
      setSelectedBlockId(blocks[prevIndex].id);
    }
  }, [blocks, updateBlocks]);

  const handleSlashSelect = React.useCallback((cmd) => {
    if (!slashBlockId || !cmd) return;
    setShowSlashMenu(false);
    handleChangeBlockType(slashBlockId, cmd.type, cmd.extra || {});
  }, [slashBlockId, handleChangeBlockType]);

  // Render individual block component
  const renderBlock = (block, index) => {
    const isSelected = block.id === selectedBlockId;
    const isSlashActive = showSlashMenu && slashBlockId === block.id;

    const props = {
      attributes: block.attributes,
      children: block.children,
      onChange: (newAttrs, newChildren) => handleUpdateBlockAttributes(block.id, newAttrs, newChildren),
      isSelected,
      isSlashActive,
      onSelect: () => setSelectedBlockId(block.id),
      onSelectSlashCommand: () => {
        const filtered = SLASH_COMMANDS.filter((cmd) => {
          if (!slashQuery) return true;
          const q = slashQuery.toLowerCase().trim();
          return (
            cmd.id.startsWith(q) ||
            cmd.label.toLowerCase().includes(q) ||
            cmd.keywords.some((k) => k.startsWith(q))
          );
        });
        if (filtered.length > 0 && filtered[slashSelectedIndex]) {
          handleSlashSelect(filtered[slashSelectedIndex]);
        }
      },
      focusPosition: isSelected ? focusPosition : "start",
      onOpenMediaModal,
      onEnterNextBlock: (nextContent = "") => handleEnterNextBlock(index, nextContent),
      onMergeWithPreviousBlock: (currentContent = "") => handleMergeWithPreviousBlock(index, block.id, currentContent),
      onDeleteEmptyBlock: () => handleDeleteEmptyBlockOnBackspace(index, block.id),
      onChangeType: (newType, extraAttrs) => handleChangeBlockType(block.id, newType, extraAttrs),
      onSlashQuery: (q, pos) => handleSlashQuery(block.id, q, pos),
      onOpenInserter: () => {
        setInsertIndex(index + 1);
        setIsInserterOpen(true);
      },
    };

    let BlockComp = ParagraphBlock;
    switch (block.type) {
      case "heading":
        BlockComp = HeadingBlock;
        break;
      case "image":
        BlockComp = ImageBlock;
        break;
      case "gallery":
        BlockComp = GalleryBlock;
        break;
      case "list":
        BlockComp = ListBlock;
        break;
      case "quote":
        BlockComp = QuoteBlock;
        break;
      case "button":
        BlockComp = ButtonBlock;
        break;
      case "columns":
        BlockComp = ColumnsBlock;
        break;
      case "code":
        BlockComp = CodeBlock;
        break;
      case "html":
      case "custom-html":
        BlockComp = CustomHtmlBlock;
        break;
      case "embed":
        BlockComp = EmbedBlock;
        break;
      case "divider":
        BlockComp = DividerBlock;
        break;
      default:
        BlockComp = ParagraphBlock;
        break;
    }

    return (
      <div
        data-block-id={block.id}
        onClick={(e) => {
          e.stopPropagation();
          if (isAllSelected) {
            setIsAllSelected(false);
            const sel = window.getSelection();
            if (sel) sel.removeAllRanges();
          }
          setSelectedBlockId(block.id);
        }}
        className={`relative mb-1 mt-0 group/block transition-all duration-150 ${
          isAllSelected
            ? "bg-indigo-600/20 ring-2 ring-indigo-500/70 rounded-xl shadow-lg shadow-indigo-500/10"
            : ""
        }`}
      >
        {/* Floating Block Toolbar */}
        {isSelected && !isAllSelected && (
          <BlockToolbar
            block={block}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDuplicate={() => handleDuplicateBlock(index)}
            onDelete={() => handleDeleteBlock(block.id)}
            onChangeType={(newType, extraAttrs) => handleChangeBlockType(block.id, newType, extraAttrs)}
            onChangeAttributes={(newAttrs) => handleUpdateBlockAttributes(block.id, newAttrs)}
          />
        )}

        <BlockComp {...props} />
      </div>
    );
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const deviceWidths = {
    desktop: "max-w-4xl",
    tablet: "max-w-2xl",
    mobile: "max-w-sm",
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#090912] text-white font-['Outfit'] select-none">
      {/* Top Header Toolbar */}
      <header className="h-12 sm:h-14 bg-[#141424] border-b border-indigo-500/20 px-2 sm:px-6 flex items-center justify-between shrink-0 z-40 shadow-xl gap-1 sm:gap-3">
        {/* Left Controls */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setInsertIndex(null);
              setIsInserterOpen(true);
            }}
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            title="Add Block"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => setIsOutlineOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            title="Block List Outline View"
          >
            <Layers size={18} />
          </button>

          <div className="w-px h-5 bg-white/10 mx-0 sm:mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>

          {/* Keyboard shortcuts — hidden on mobile */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer ml-1"
            title="Keyboard Shortcuts Help"
          >
            <Keyboard size={16} />
          </button>
        </div>

        {/* Device Responsiveness Toggle — hidden on mobile (use the preview on device) */}
        <div className="hidden sm:flex items-center gap-1 bg-[#0a0a14] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              deviceMode === "desktop" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
            title="Desktop View"
          >
            <Monitor size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              deviceMode === "tablet" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
            title="Tablet View"
          >
            <Tablet size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              deviceMode === "mobile" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
            title="Mobile View"
          >
            <Smartphone size={15} />
          </button>
        </div>

        {/* Save / Update Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isInspectorOpen
                ? "bg-indigo-600/25 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-600/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title={isInspectorOpen ? "Collapse Settings Sidebar" : "Expand Settings Sidebar"}
          >
            <Sliders size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              const html = blocksToHtml(blocks, { includeDelimiters: true });
              const structured = {
                version: 1,
                blocks: blocks.map((b) => ({
                  id: b.id,
                  type: b.type === "custom-html" ? "html" : b.type,
                  attrs: b.attrs || b.attributes || {},
                  content: b.content !== undefined ? b.content : (b.attributes?.content || b.attributes?.html || b.attributes?.code || ""),
                  children: b.children || [],
                })),
              };
              onSave && onSave(html, structured, "Draft");
            }}
            disabled={saving}
            className="hidden sm:flex px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              const html = blocksToHtml(blocks, { includeDelimiters: true });
              const structured = {
                version: 1,
                blocks: blocks.map((b) => ({
                  id: b.id,
                  type: b.type === "custom-html" ? "html" : b.type,
                  attrs: b.attrs || b.attributes || {},
                  content: b.content !== undefined ? b.content : (b.attributes?.content || b.attributes?.html || b.attributes?.code || ""),
                  children: b.children || [],
                })),
              };
              onSave && onSave(html, structured, "Published");
            }}
            disabled={saving}
            className="px-3.5 sm:px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            title={postStatus === "Published" ? "Update post" : "Publish post"}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            <span>{postStatus === "Published" ? "Update" : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* Main Body (Canvas + Inspector Sidebar) */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-56px)] relative">
        {/* Floating Right Expand Edge Tab */}
        {!isInspectorOpen && (
          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className="absolute top-6 right-0 z-40 py-3 px-2 bg-gradient-to-l from-indigo-600 via-indigo-600 to-purple-600 text-white rounded-l-2xl shadow-2xl border-l border-y border-white/20 hover:px-3 transition-all duration-300 cursor-pointer group flex items-center gap-1 text-xs font-bold"
            title="Expand Inspector Sidebar"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* Canvas Area */}
        <main
          onClick={(e) => {
            if (isAllSelected) {
              setIsAllSelected(false);
              const sel = window.getSelection();
              if (sel) sel.removeAllRanges();
            }
            ctrlACountRef.current = 0;

            if (e.target.tagName === "MAIN" || e.target.id === "canvas-inner") {
              const lastBlock = blocks[blocks.length - 1];
              if (!lastBlock || lastBlock.type !== "paragraph" || (lastBlock.attributes?.content || "").trim() !== "") {
                const newBlock = createBlock("paragraph", { content: "" });
                const updated = [...blocks, newBlock];
                updateBlocks(updated);
                setSelectedBlockId(newBlock.id);
              } else {
                setSelectedBlockId(lastBlock.id);
              }
            }
          }}
          className="flex-1 overflow-y-auto px-3 sm:px-8 md:px-16 py-5 sm:py-8 md:py-12 flex justify-center bg-[#0d0d18] cursor-text"
        >
          <div id="canvas-inner" className={`w-full ${deviceWidths[deviceMode]} px-2 sm:px-6 md:px-10 min-w-0 break-words transition-all duration-300 min-h-[500px] mx-auto`}>
            {/* Post Title Field (Main Heading - Excluded from Select All) */}
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Add post title..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full bg-transparent text-3xl sm:text-4xl font-extrabold text-white outline-none placeholder-gray-600 font-['Outfit'] tracking-tight mb-6"
            />

            {/* Blocks Canvas List Container (Select All Target, excludes Main Heading) */}
            <div
              id="blocks-canvas-container"
              ref={blocksContainerRef}
              className="w-full select-text selection:bg-indigo-500/40 selection:text-white"
            >
              {blocks.map((block, idx) => (
                <React.Fragment key={block.id}>
                  {renderBlock(block, idx)}
                  
                  {/* WordPress Centered Hover Inserter Line between blocks (Zero Layout Height) */}
                  <div className="relative h-0 flex items-center justify-center opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 group/inserter z-30">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover/inserter:via-indigo-500 transition-colors pointer-events-none" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsertIndex(idx + 1);
                        setIsInserterOpen(true);
                      }}
                      className="relative z-10 w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-600/30 transition-transform scale-90 group-hover/inserter:scale-110 cursor-pointer -translate-y-1/2"
                      title="Add block here"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>

          </div>
        </main>

        {/* Right Inspector Sidebar */}
        {isInspectorOpen && (
          <BlockInspectorSidebar
            selectedBlock={selectedBlock}
            onChangeBlockAttributes={(newAttrs) => {
              if (selectedBlockId) handleUpdateBlockAttributes(selectedBlockId, newAttrs);
            }}
            onClose={() => setIsInspectorOpen(false)}
            title={postTitle}
            setTitle={setPostTitle}
            slug={postSlug}
            setSlug={setPostSlug}
            status={postStatus}
            setStatus={setPostStatus}
            description={description}
            setDescription={setDescription}
            focusKeyword={focusKeyword}
            setFocusKeyword={setFocusKeyword}
            tags={tags}
            setTags={setTags}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            imageAlt={imageAlt}
            setImageAlt={setImageAlt}
            imageTitle={imageTitle}
            setImageTitle={setImageTitle}
            onOpenMediaModal={onOpenMediaModal}
          />
        )}
      </div>

      {/* Block Inserter Flyout Modal */}
      <BlockInserter
        isOpen={isInserterOpen}
        onClose={() => setIsInserterOpen(false)}
        onSelectBlock={(type) => handleAddBlock(type, insertIndex)}
      />

      {/* Block Outline Tree View Drawer */}
      <BlockOutlineDrawer
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        onSelectBlock={(id) => setSelectedBlockId(id)}
        onDeleteBlock={(id) => handleDeleteBlock(id)}
      />

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsModal && mounted && createPortal(
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center items-start pt-20 sm:pt-24 pb-8 px-3 sm:px-4 animate-in fade-in duration-200">
          <div className="relative bg-[#141424] border border-indigo-500/40 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden my-auto sm:my-0">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between border-b border-white/12 px-5 sm:px-6 py-4 shrink-0 bg-[#18182b] z-20">
              <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm sm:text-base">
                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Keyboard size={18} />
                </div>
                <span className="text-white font-['Outfit'] font-bold text-sm sm:text-base tracking-tight">
                  WordPress Gutenberg Keyboard Shortcuts
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer shrink-0"
                title="Close Modal (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-gray-300">
              {/* Block Controls */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2.5">Block Navigation & Editing</h4>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Select All Blog Content (Excludes Title)</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Press Ctrl + A (3 times)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Remove / Delete Selected Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Shift + Alt + Z / Del</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Duplicate Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Shift + D</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Insert Block BEFORE</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + T</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Insert Block AFTER</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + Y</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Move Block Up / Down</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Shift + ↑ / ↓</span>
                  </div>
                </div>
              </div>

              {/* Heading & Block Transformations */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2.5">Heading Levels & Block Transformations</h4>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to Heading 1 .. 6</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + 1 ... 6</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to Paragraph</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + P</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to Code Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + C</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to Quote Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + Q</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to List Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + U</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Convert to Custom HTML</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Alt + K</span>
                  </div>
                </div>
              </div>

              {/* Global Editor Controls */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2.5">Editor Controls & Navigation</h4>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Save Post / Draft</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + S</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Undo / Redo</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Z / Ctrl + Y</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Toggle List View Outline</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Ctrl + Shift + Alt + O</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Open Shortcuts Help</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Shift + Alt + H / Ctrl + Shift + ?</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Slash Block Inserter</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Type / in Paragraph</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white text-xs sm:text-sm">Deselect / Close Modals</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2.5 py-1 rounded-lg font-mono text-[11px] sm:text-xs font-bold border border-indigo-500/30 shrink-0 self-start sm:self-auto">Escape</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 text-right shrink-0 bg-[#141424]">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Floating Slash Menu Popover */}
      {showSlashMenu && slashPos && (
        <SlashMenuPopover
          query={slashQuery || ""}
          position={slashPos}
          selectedIndex={slashSelectedIndex}
          setSelectedIndex={setSlashSelectedIndex}
          onSelect={handleSlashSelect}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
}
