import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  Loader2,
  Slash,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { createBlock, BLOCK_DEFINITIONS } from "./utils/blockTypes";
import { blocksToHtml, htmlToBlocks } from "./utils/serializer";

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

export default function BlockEditorContainer({
  initialHtml = "",
  initialBlocks = null,
  onSave,
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
  onOpenMediaModal,
}) {
  // State for Blocks Array
  const [blocks, setBlocks] = useState(() => {
    if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
      return initialBlocks;
    }
    return htmlToBlocks(initialHtml);
  });

  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Undo / Redo Stack
  const [history, setHistory] = useState([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // UI Modals / Panels
  const [isInserterOpen, setIsInserterOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState("desktop"); // desktop, tablet, mobile
  const [insertIndex, setInsertIndex] = useState(null);

  // Slash Command Menu
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSearch, setSlashSearch] = useState("");
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
      setBlocks(initialBlocks);
      setHistory([initialBlocks]);
      setHistoryIndex(0);
      isLoadedRef.current = true;
    } else if (initialHtml && initialHtml.trim() && !isLoadedRef.current) {
      const parsed = htmlToBlocks(initialHtml);
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

      // 1. Save Post: Ctrl + S / Cmd + S
      if (isCmdOrCtrl && key === "s") {
        e.preventDefault();
        const htmlOutput = blocksToHtml(blocks);
        if (onSave) onSave(htmlOutput, blocks, postStatus);
        return;
      }

      // 2. Undo: Ctrl + Z / Cmd + Z (without Shift)
      if (isCmdOrCtrl && key === "z" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // 3. Redo: Ctrl + Y / Cmd + Y OR Ctrl + Shift + Z / Cmd + Shift + Z
      if ((isCmdOrCtrl && e.shiftKey && key === "z") || (isCmdOrCtrl && key === "y")) {
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
        ((e.shiftKey && e.altKey && key === "z") ||
         (!isInput && (e.key === "Delete" || e.key === "Backspace"))) &&
        selectedBlockId
      ) {
        e.preventDefault();
        handleDeleteBlock(selectedBlockId);
        return;
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

      // 13. Heading Level & Transform Shortcuts: (Ctrl + Alt + 1..6 OR Shift + Alt + 1..6)
      if ((isCmdOrCtrl && e.altKey) || (e.shiftKey && e.altKey)) {
        if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) {
            const hLevel = parseInt(e.key, 10);
            handleChangeBlockType(targetId, "heading", { level: hLevel });
          }
          return;
        }

        // Transform to Paragraph: Ctrl + Alt + P / Shift + Alt + P
        if (key === "p") {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
          if (targetId) handleChangeBlockType(targetId, "paragraph");
          return;
        }

        // Transform to Heading H2: Ctrl + Alt + H / Shift + Alt + H
        if (key === "h" && !e.shiftKey) {
          e.preventDefault();
          const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
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
  }, [blocks, selectedBlockId, historyIndex, history, onSave, postStatus, showShortcutsModal, isInserterOpen, isOutlineOpen]);

  // Update blocks with history tracking
  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  // Add block at specific index or at the end
  const handleAddBlock = (type, targetIdx = null) => {
    const newBlock = createBlock(type);
    const idx = targetIdx !== null ? targetIdx : blocks.length;
    const updated = [...blocks];
    updated.splice(idx, 0, newBlock);
    updateBlocks(updated);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlockAttributes = (blockId, newAttributes, newChildren = null) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          attributes: { ...b.attributes, ...newAttributes },
          ...(newChildren ? { children: newChildren } : {}),
        };
      }
      return b;
    });
    updateBlocks(updated);
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updateBlocks(updated);
  };

  const handleMoveDown = (index) => {
    if (index >= blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updateBlocks(updated);
  };

  const handleDuplicateBlock = (index) => {
    const targetBlock = blocks[index];
    if (!targetBlock) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(targetBlock)),
      id: "block_" + Math.random().toString(36).substring(2, 9),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    updateBlocks(updated);
    setSelectedBlockId(duplicated.id);
  };

  const handleDeleteBlock = (blockId) => {
    if (blocks.length <= 1) {
      updateBlocks([createBlock("paragraph", { content: "" })]);
      return;
    }
    const updated = blocks.filter((b) => b.id !== blockId);
    updateBlocks(updated);
    setSelectedBlockId(null);
  };

  const handleChangeBlockType = (blockId, newType, extraAttrs = {}) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        return createBlock(newType, { ...b.attributes, ...extraAttrs });
      }
      return b;
    });
    updateBlocks(updated);
  };

  // Render individual block component
  const renderBlock = (block, index) => {
    const isSelected = block.id === selectedBlockId;
    const props = {
      attributes: block.attributes,
      children: block.children,
      onChange: (newAttrs, newChildren) => handleUpdateBlockAttributes(block.id, newAttrs, newChildren),
      isSelected,
      onOpenMediaModal,
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
        key={block.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBlockId(block.id);
        }}
        className={`relative group/card transition-all my-2 rounded-2xl p-2 border ${
          isSelected ? "border-indigo-500 bg-indigo-500/[0.04] shadow-lg shadow-indigo-500/10" : "border-transparent hover:border-white/10"
        }`}
      >
        {/* Floating Block Toolbar */}
        {isSelected && (
          <BlockToolbar
            block={block}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDuplicate={() => handleDuplicateBlock(index)}
            onDelete={() => handleDeleteBlock(block.id)}
            onChangeType={(newType) => handleChangeBlockType(block.id, newType)}
            onChangeAttributes={(newAttrs) => handleUpdateBlockAttributes(block.id, newAttrs)}
          />
        )}

        <BlockComp {...props} />

        {/* Hover "+" Bar Between Blocks */}
        <div className="absolute -bottom-3 left-0 right-0 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setInsertIndex(index + 1);
              setIsInserterOpen(true);
            }}
            className="pointer-events-auto w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-600/50 cursor-pointer transition-all hover:scale-110"
            title="Add Block Here"
          >
            +
          </button>
        </div>
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
    <div className="flex flex-col h-screen bg-[#090912] text-white overflow-hidden font-['Outfit'] select-none">
      {/* Top Header Toolbar */}
      <header className="h-14 bg-[#141424] border-b border-indigo-500/20 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setInsertIndex(null);
              setIsInserterOpen(true);
            }}
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
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

          <div className="w-px h-5 bg-white/10 mx-1" />

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

          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer ml-1"
            title="Keyboard Shortcuts Help"
          >
            <Keyboard size={16} />
          </button>
        </div>

        {/* Device Responsiveness Toggle */}
        <div className="flex items-center gap-1 bg-[#0a0a14] p-1 rounded-xl border border-white/10">
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const html = blocksToHtml(blocks);
              onSave && onSave(html, blocks, "Draft");
            }}
            disabled={saving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              const html = blocksToHtml(blocks);
              onSave && onSave(html, blocks, "Published");
            }}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Publish Post
          </button>
        </div>
      </header>

      {/* Main Body (Canvas + Inspector Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <main
          onClick={() => setSelectedBlockId(null)}
          className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#0d0d18]"
        >
          <div className={`w-full ${deviceWidths[deviceMode]} transition-all duration-300 space-y-4`}>
            {/* Post Title Field */}
            <input
              type="text"
              placeholder="Add post title..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full bg-transparent text-3xl sm:text-4xl font-extrabold text-white outline-none placeholder-gray-600 font-['Outfit'] tracking-tight mb-6"
            />

            {/* Blocks Canvas List */}
            {blocks.map((block, idx) => renderBlock(block, idx))}

            {/* Bottom Add Block Trigger */}
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setInsertIndex(null);
                  setIsInserterOpen(true);
                }}
                className="px-4 py-2.5 bg-[#141424] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 rounded-2xl text-xs font-bold text-indigo-300 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Plus size={15} /> Add Block
              </button>
            </div>
          </div>
        </main>

        {/* Right Inspector Sidebar */}
        <BlockInspectorSidebar
          selectedBlock={selectedBlock}
          onChangeBlockAttributes={(newAttrs) => {
            if (selectedBlockId) handleUpdateBlockAttributes(selectedBlockId, newAttrs);
          }}
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
          onOpenMediaModal={onOpenMediaModal}
        />
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
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#141424] border border-indigo-500/30 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-base">
                <Keyboard size={20} />
                <span>WordPress Gutenberg Keyboard Shortcuts</span>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              {/* Block Controls */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Block Navigation & Editing</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Remove / Delete Selected Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Shift + Alt + Z / Del</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Duplicate Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Shift + D</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Insert Block BEFORE</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + T</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Insert Block AFTER</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + Y</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Move Block Up / Down</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Shift + ↑ / ↓</span>
                  </div>
                </div>
              </div>

              {/* Heading & Block Transformations */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Heading Levels & Block Transformations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to Heading 1 .. 6</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + 1 ... 6</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to Paragraph</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + P</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to Code Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + C</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to Quote Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + Q</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to List Block</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + U</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Convert to Custom HTML</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Alt + K</span>
                  </div>
                </div>
              </div>

              {/* Global Editor Controls */}
              <div>
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Editor Controls & Navigation</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Save Post / Draft</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + S</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Undo / Redo</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Z / Ctrl + Y</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Toggle List View Outline</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Ctrl + Shift + Alt + O</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Open Shortcuts Help</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Shift + Alt + H / Ctrl + Shift + ?</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Slash Block Inserter</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Type / in Paragraph</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090912] border border-white/5">
                    <span className="font-semibold text-white">Deselect / Close Modals</span>
                    <span className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded font-mono font-bold border border-indigo-500/30">Escape</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
