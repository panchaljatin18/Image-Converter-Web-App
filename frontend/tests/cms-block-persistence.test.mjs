import assert from "node:assert";
import { createBlock, normalizeBlock, normalizeBlockState } from "../src/components/BlockEditor/utils/blockTypes.js";
import { blocksToHtml, htmlToBlocks, parseLegacyHtmlToBlocks } from "../src/components/BlockEditor/utils/serializer.js";

let passedCount = 0;
let failedCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`);
    console.error(err);
    failedCount++;
  }
}

console.log("\n========================================================");
console.log("  CMS Editor Block Identity & Persistence Test Suite  ");
console.log("========================================================\n");

// --- TEST CASE 1: Paragraph save and reopen ---
test("Case 1: Paragraph block preserves type and content through save/reopen cycle", () => {
  const original = [
    createBlock("paragraph", { content: "This is a simple paragraph." })
  ];

  // 1. Save flow: structured state -> persisted JSON
  const savedState = normalizeBlockState(original);
  assert.strictEqual(savedState.version, 1);
  assert.strictEqual(savedState.blocks[0].type, "paragraph");

  // 2. Delimited HTML representation
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });
  assert.match(delimitedHtml, /<!-- block:paragraph/);

  // 3. Reopen flow: load from structured blocks
  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks.length, 1);
  assert.strictEqual(reopenedFromBlocks[0].type, "paragraph");
  assert.strictEqual(reopenedFromBlocks[0].content, "This is a simple paragraph.");

  // 4. Reopen flow: load from delimited HTML fallback
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml.length, 1);
  assert.strictEqual(reopenedFromHtml[0].type, "paragraph");
  assert.strictEqual(reopenedFromHtml[0].content, "This is a simple paragraph.");
});

// --- TEST CASE 2: HTML Block save and reopen ---
test("Case 2: HTML block preserves type and raw markup verbatim through save/reopen cycle", () => {
  const htmlContent = '<div class="custom-card"><button class="btn">Click Me</button></div>';
  const original = [
    createBlock("html", { html: htmlContent, content: htmlContent })
  ];

  // 1. Save structured state
  const savedState = normalizeBlockState(original);
  assert.strictEqual(savedState.blocks[0].type, "html");

  // 2. Delimited HTML
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });
  assert.match(delimitedHtml, /<!-- block:html -->/);
  assert.ok(delimitedHtml.includes(htmlContent));

  // 3. Reopen from structured
  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks[0].type, "html");
  assert.strictEqual(reopenedFromBlocks[0].content, htmlContent);

  // 4. Reopen from HTML
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml[0].type, "html");
  assert.strictEqual(reopenedFromHtml[0].content, htmlContent);
});

// --- TEST CASE 3: Paragraph + HTML Block combination ---
test("Case 3: Paragraph + HTML block preserves distinct identities without cross-conversion", () => {
  const original = [
    createBlock("paragraph", { content: "Introduction text before the widget." }),
    createBlock("html", { content: '<div class="alert-box"><strong>Warning:</strong> Be careful!</div>' })
  ];

  const savedState = normalizeBlockState(original);
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });

  // Reopen from structured state
  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks.length, 2);
  assert.strictEqual(reopenedFromBlocks[0].type, "paragraph");
  assert.strictEqual(reopenedFromBlocks[0].content, "Introduction text before the widget.");
  assert.strictEqual(reopenedFromBlocks[1].type, "html");
  assert.strictEqual(reopenedFromBlocks[1].content, '<div class="alert-box"><strong>Warning:</strong> Be careful!</div>');

  // Reopen from delimited HTML
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml.length, 2);
  assert.strictEqual(reopenedFromHtml[0].type, "paragraph");
  assert.strictEqual(reopenedFromHtml[0].content, "Introduction text before the widget.");
  assert.strictEqual(reopenedFromHtml[1].type, "html");
  assert.strictEqual(reopenedFromHtml[1].content, '<div class="alert-box"><strong>Warning:</strong> Be careful!</div>');
});

// --- TEST CASE 4: Multiple consecutive Paragraphs ---
test("Case 4: Consecutive paragraphs remain distinct paragraph blocks (never merged or converted to HTML)", () => {
  const original = [
    createBlock("paragraph", { content: "First paragraph." }),
    createBlock("paragraph", { content: "Second paragraph." }),
    createBlock("paragraph", { content: "Third paragraph." })
  ];

  const savedState = normalizeBlockState(original);
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });

  // Reopen from structured state
  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks.length, 3);
  assert.strictEqual(reopenedFromBlocks[0].type, "paragraph");
  assert.strictEqual(reopenedFromBlocks[1].type, "paragraph");
  assert.strictEqual(reopenedFromBlocks[2].type, "paragraph");

  // Reopen from delimited HTML
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml.length, 3);
  assert.strictEqual(reopenedFromHtml[0].type, "paragraph");
  assert.strictEqual(reopenedFromHtml[0].content, "First paragraph.");
  assert.strictEqual(reopenedFromHtml[1].type, "paragraph");
  assert.strictEqual(reopenedFromHtml[1].content, "Second paragraph.");
  assert.strictEqual(reopenedFromHtml[2].type, "paragraph");
  assert.strictEqual(reopenedFromHtml[2].content, "Third paragraph.");
});

// --- TEST CASE 5: HTML Block with nested tags (sections, divs, headings, paragraphs) ---
test("Case 5: HTML block with complex nested tags is preserved intact without splitting", () => {
  const complexHtml = `<section class="hero-section">
  <div class="wrapper">
    <h2>Nested Title Inside HTML</h2>
    <p>Nested paragraph text inside HTML block.</p>
    <a href="#" class="cta-button">Action</a>
  </div>
</section>`;

  const original = [
    createBlock("html", { html: complexHtml, content: complexHtml })
  ];

  const savedState = normalizeBlockState(original);
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });

  // Verify single block in structured state
  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks.length, 1);
  assert.strictEqual(reopenedFromBlocks[0].type, "html");
  assert.strictEqual(reopenedFromBlocks[0].content, complexHtml);

  // Verify single block when parsed from delimited HTML
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml.length, 1, "Must NOT split into multiple heading/paragraph blocks");
  assert.strictEqual(reopenedFromHtml[0].type, "html");
  assert.strictEqual(reopenedFromHtml[0].content, complexHtml);
});

// --- TEST CASE 6: Heading save and reopen ---
test("Case 6: Heading block preserves level, alignment, and content", () => {
  const original = [
    createBlock("heading", { level: 3, align: "center", content: "Section Subheading" })
  ];

  const savedState = normalizeBlockState(original);
  assert.strictEqual(savedState.blocks[0].type, "heading");
  assert.strictEqual(savedState.blocks[0].attrs.level, 3);

  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });
  assert.match(delimitedHtml, /<!-- block:heading.*"level":3/);

  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks[0].type, "heading");
  assert.strictEqual(reopenedFromBlocks[0].attrs.level, 3);
  assert.strictEqual(reopenedFromBlocks[0].content, "Section Subheading");

  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml[0].type, "heading");
  assert.strictEqual(reopenedFromHtml[0].attrs.level, 3);
  assert.strictEqual(reopenedFromHtml[0].content, "Section Subheading");
});

// --- TEST CASE 7: Code Block with HTML-like syntax ---
test("Case 7: Code block with HTML tags in content is preserved as code, never converted to HTML block", () => {
  const codeContent = 'function App() {\n  return <div className="test">Hello World</div>;\n}';
  const original = [
    createBlock("code", { language: "jsx", code: codeContent, content: codeContent })
  ];

  const savedState = normalizeBlockState(original);
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });

  const reopenedFromBlocks = normalizeBlockState(savedState).blocks;
  assert.strictEqual(reopenedFromBlocks[0].type, "code");
  assert.strictEqual(reopenedFromBlocks[0].content, codeContent);

  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  assert.strictEqual(reopenedFromHtml[0].type, "code");
  assert.strictEqual(reopenedFromHtml[0].content, codeContent);
});

// --- TEST CASE 8: Mixed sequence of blocks ---
test("Case 8: Mixed sequence (Paragraph -> Heading -> HTML -> Paragraph -> Code) preserves exact sequence and types", () => {
  const original = [
    createBlock("paragraph", { content: "Introductory remarks." }),
    createBlock("heading", { level: 2, content: "Main Section" }),
    createBlock("html", { content: '<div class="banner">Custom Widget</div>' }),
    createBlock("paragraph", { content: "Post-widget commentary." }),
    createBlock("code", { language: "python", content: 'print("Finished")' })
  ];

  const savedState = normalizeBlockState(original);
  const expectedTypes = ["paragraph", "heading", "html", "paragraph", "code"];

  // 1. Verify structured state sequence
  const blockTypes = savedState.blocks.map(b => b.type);
  assert.deepStrictEqual(blockTypes, expectedTypes);

  // 2. Verify delimited HTML parse sequence
  const delimitedHtml = blocksToHtml(savedState.blocks, { includeDelimiters: true });
  const reopenedFromHtml = htmlToBlocks(delimitedHtml);
  const htmlBlockTypes = reopenedFromHtml.map(b => b.type);
  assert.deepStrictEqual(htmlBlockTypes, expectedTypes);
  assert.strictEqual(reopenedFromHtml[0].content, "Introductory remarks.");
  assert.strictEqual(reopenedFromHtml[1].content, "Main Section");
  assert.strictEqual(reopenedFromHtml[2].content, '<div class="banner">Custom Widget</div>');
  assert.strictEqual(reopenedFromHtml[3].content, "Post-widget commentary.");
  assert.strictEqual(reopenedFromHtml[4].content, 'print("Finished")');
});

// --- TEST CASE 9: Draft save and reopen ---
test("Case 9: Draft post save and reopen preserves structured block state", () => {
  const draftPost = {
    title: "My Draft Post",
    status: "Draft",
    content_blocks: {
      version: 1,
      blocks: [
        createBlock("heading", { level: 1, content: "Draft Title" }),
        createBlock("paragraph", { content: "Draft body paragraph." }),
        createBlock("html", { content: '<div id="draft-embed">Embed</div>' })
      ]
    }
  };

  // Reopen simulation (admin editor load)
  const loadedBlocks = normalizeBlockState(draftPost.content_blocks).blocks;
  assert.strictEqual(loadedBlocks.length, 3);
  assert.strictEqual(loadedBlocks[0].type, "heading");
  assert.strictEqual(loadedBlocks[1].type, "paragraph");
  assert.strictEqual(loadedBlocks[2].type, "html");
});

// --- TEST CASE 10: Published post save and reopen ---
test("Case 10: Published post produces clean public HTML and preserves structured blocks for reopening", () => {
  const publishedBlocks = [
    createBlock("heading", { level: 2, content: "Published Article" }),
    createBlock("paragraph", { content: "This is published text." }),
    createBlock("html", { content: '<div class="cta"><a href="#">Subscribe</a></div>' })
  ];

  // 1. Structured block state
  const structuredState = normalizeBlockState(publishedBlocks);

  // 2. Public HTML must NOT contain delimiter comments
  const publicHtml = blocksToHtml(structuredState.blocks, { includeDelimiters: false, forPublic: true });
  assert.ok(!publicHtml.includes("<!-- block:"), "Public HTML must omit delimiters");
  assert.ok(!publicHtml.includes("<!-- /block:"), "Public HTML must omit closing delimiters");
  assert.ok(publicHtml.includes("Published Article"));
  assert.ok(publicHtml.includes("This is published text."));
  assert.ok(publicHtml.includes('<div class="cta"><a href="#">Subscribe</a></div>'));

  // 3. Reopen for edit using structuredState
  const reloadedBlocks = normalizeBlockState(structuredState).blocks;
  assert.strictEqual(reloadedBlocks[0].type, "heading");
  assert.strictEqual(reloadedBlocks[1].type, "paragraph");
  assert.strictEqual(reloadedBlocks[2].type, "html");
});

// --- TEST CASE 11: Refresh browser before saving (Draft auto-save / localStorage simulation) ---
test("Case 11: Refresh browser before saving (localStorage draft restore simulation)", () => {
  const liveBlocks = [
    createBlock("paragraph", { content: "Unsaved live paragraph" }),
    createBlock("html", { content: "<form><input type='email' /></form>" })
  ];

  // Emulate localStorage draft serialization
  const draftPayload = JSON.stringify({
    title: "Working Post",
    content: blocksToHtml(liveBlocks, { includeDelimiters: true }),
    content_blocks: { version: 1, blocks: liveBlocks },
    timestamp: Date.now()
  });

  // Emulate page reload: parse from localStorage
  const restoredDraft = JSON.parse(draftPayload);
  const restoredBlocks = normalizeBlockState(restoredDraft.content_blocks).blocks;

  assert.strictEqual(restoredBlocks.length, 2);
  assert.strictEqual(restoredBlocks[0].type, "paragraph");
  assert.strictEqual(restoredBlocks[0].content, "Unsaved live paragraph");
  assert.strictEqual(restoredBlocks[1].type, "html");
  assert.strictEqual(restoredBlocks[1].content, "<form><input type='email' /></form>");
});

// --- TEST CASE 12: Neighbor block isolation ---
test("Case 12: Neighbor block modification strictly isolates changes without affecting adjacent blocks", () => {
  const blocks = [
    createBlock("paragraph", { content: "First paragraph - original" }),
    createBlock("html", { content: '<div class="static-widget">Do Not Touch Me</div>' }),
    createBlock("paragraph", { content: "Third paragraph - original" })
  ];

  const htmlBlockOriginal = JSON.parse(JSON.stringify(blocks[1]));

  // Simulate user updating Paragraph 0 and Paragraph 2 in editor
  const updatedBlocks = blocks.map(block => {
    if (block.id === blocks[0].id) {
      return { ...block, content: "First paragraph - updated" };
    }
    if (block.id === blocks[2].id) {
      return { ...block, content: "Third paragraph - updated" };
    }
    return block;
  });

  // Verify HTML block is 100% identical
  assert.strictEqual(updatedBlocks[1].id, htmlBlockOriginal.id);
  assert.strictEqual(updatedBlocks[1].type, "html");
  assert.strictEqual(updatedBlocks[1].content, htmlBlockOriginal.content);

  // Verify serialized & re-parsed output preserves HTML block untouched
  const delimited = blocksToHtml(updatedBlocks, { includeDelimiters: true });
  const reloaded = htmlToBlocks(delimited);
  assert.strictEqual(reloaded[0].content, "First paragraph - updated");
  assert.strictEqual(reloaded[1].type, "html");
  assert.strictEqual(reloaded[1].content, '<div class="static-widget">Do Not Touch Me</div>');
  assert.strictEqual(reloaded[2].content, "Third paragraph - updated");
});

// --- TEST CASE 13 (Bonus): Backward compatibility with legacy un-delimited HTML ---
test("Case 13 (Bonus): Backward compatibility for legacy posts without metadata", () => {
  const legacyHtml = `<p>Legacy paragraph one.</p>
<h2>Legacy Heading</h2>
<p>Legacy paragraph two.</p>
<pre><code class="language-js">console.log(123);</code></pre>
<div class="custom-legacy-embed"><span>Special</span></div>`;

  const parsed = parseLegacyHtmlToBlocks(legacyHtml);
  assert.strictEqual(parsed.length, 5);
  assert.strictEqual(parsed[0].type, "paragraph");
  assert.strictEqual(parsed[0].content, "Legacy paragraph one.");
  assert.strictEqual(parsed[1].type, "heading");
  assert.strictEqual(parsed[1].content, "Legacy Heading");
  assert.strictEqual(parsed[2].type, "paragraph");
  assert.strictEqual(parsed[2].content, "Legacy paragraph two.");
  assert.strictEqual(parsed[3].type, "code");
  assert.strictEqual(parsed[4].type, "html");
  assert.strictEqual(parsed[4].content, '<div class="custom-legacy-embed"><span>Special</span></div>');
});

console.log("\n========================================================");
console.log(`Results: ${passedCount} passed, ${failedCount} failed.`);
console.log("========================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
