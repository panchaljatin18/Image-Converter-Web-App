/**
 * startup/toolCheck.js
 *
 * Runs at server boot to verify all external CLI tools.
 * Prints a coloured ✓/✗ summary table — NON-FATAL.
 * The server starts regardless; missing tools only affect their specific features.
 *
 * Called once from server.js before mongoose.connect().
 */

const imageService       = require("../services/imageService");
const documentService     = require("../services/documentService");
const pdfService          = require("../services/pdfService");
const pythonService       = require("../services/pythonService");
const TOOLS = require("../config/tools");

// ANSI colours
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";
const GREY   = "\x1b[90m";

const tools = [
  {
    name:     "ImageMagick",
    command:  TOOLS.IMAGEMAGICK,
    check:    () => imageService.checkInstallation(),
    required: true,   // Core — most image conversions depend on this
  },
  {
    name:     "LibreOffice",
    command:  TOOLS.LIBREOFFICE,
    check:    () => documentService.checkInstallation(),
    required: false,
  },
  {
    name:     "Ghostscript",
    command:  TOOLS.GHOSTSCRIPT,
    check:    () => pdfService.checkInstallation(),
    required: false,
  },
  {
    name:     "Python",
    command:  TOOLS.PYTHON,
    check:    () => pythonService.checkInstallation(),
    required: false,
  },
];

/**
 * Run all tool checks in parallel and print a summary table.
 * @returns {Promise<void>}
 */
async function runToolCheck() {
  console.log(`\n${BOLD}  Tool Availability Check${RESET}`);
  console.log(`  ${"─".repeat(60)}`);

  const results = await Promise.allSettled(tools.map((t) => t.check()));

  let hasMissingRequired = false;

  results.forEach((result, i) => {
    const tool = tools[i];
    const available = result.status === "fulfilled" && result.value?.available;
    const version   = available ? (result.value.version || "").slice(0, 60) : "";
    const icon   = available ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const label  = available ? `${GREEN}Installed${RESET}` : `${RED}Missing${RESET}`;
    const req    = tool.required ? `${YELLOW}[required]${RESET}` : `${GREY}[optional]${RESET}`;
    const vStr   = version ? `${GREY}(${version})${RESET}` : "";

    console.log(`  ${icon} ${BOLD}${tool.name.padEnd(22)}${RESET} ${label} ${req} ${vStr}`);
    console.log(`    ${GREY}command: "${tool.command}"${RESET}`);

    if (!available && tool.required) {
      hasMissingRequired = true;
    }
  });

  console.log(`  ${"─".repeat(60)}`);

  if (hasMissingRequired) {
    console.warn(
      `\n${YELLOW}  ⚠  One or more REQUIRED tools are missing.${RESET}` +
      `\n     Set the command name in .env (see .env.example) and restart.\n`
    );
  } else {
    console.log(`\n${GREEN}  All required tools are available.${RESET}\n`);
  }
}

module.exports = { runToolCheck };
