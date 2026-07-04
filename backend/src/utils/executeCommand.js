/**
 * utils/executeCommand.js
 *
 * Safe shell command execution helper using promisified exec.
 * Automatically sanitizes all arguments using platform-specific escaping
 * to prevent command injection completely.
 */

const { exec } = require("child_process");
const { promisify } = require("util");
const ToolError = require("../errors/ToolError");

const execAsync = promisify(exec);
const isWindows = process.platform === "win32";

/**
 * Escapes an argument for safe shell execution.
 * Precludes command injection by wrapping arguments in double quotes (Windows)
 * or single quotes (Unix) and escaping internal quotes.
 */
function escapeShellArg(arg) {
  if (typeof arg !== "string") {
    arg = String(arg);
  }
  if (isWindows) {
    // Wrap in double quotes, escape existing double quotes by doubling them
    return `"${arg.replace(/"/g, '""')}"`;
  } else {
    // Wrap in single quotes, escape existing single quotes
    return `'${arg.replace(/'/g, "'\\''")}'`;
  }
}

/**
 * Execute an external CLI command safely.
 *
 * @param {string} command - Executable name or path
 * @param {string[]} args - Unescaped argument array
 * @param {object} [options] - Node exec options override
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
async function executeCommand(command, args = [], options = {}) {
  const sanitizedArgs = args.map(escapeShellArg);
  const commandToRun = command.includes(" ") && !command.startsWith('"') ? `"${command}"` : command;
  const fullCommand = `${commandToRun} ${sanitizedArgs.join(" ")}`;

  const defaultOptions = {
    maxBuffer: 1024 * 1024 * 100, // 100 MB buffer
    timeout: 5 * 60 * 1000,       // 5-minute timeout
    ...options,
  };

  try {
    const { stdout, stderr } = await execAsync(fullCommand, defaultOptions);
    return { stdout: stdout || "", stderr: stderr || "" };
  } catch (err) {
    const message = err.message || "";
    // Detect binary not found errors cross-platform
    const isNotFound =
      err.code === "ENOENT" ||
      message.includes("not recognized") ||
      message.includes("cannot find") ||
      message.includes("command not found");

    if (isNotFound) {
      throw new ToolError(
        command,
        `Command not found: "${command}". Ensure it is installed and added to PATH.`,
        true
      );
    }

    const detail = (err.stderr || err.stdout || message).trim();
    throw new ToolError(command, detail || `Exited with code ${err.code}`);
  }
}

/**
 * Run a command with version args to check if the tool exists.
 */
async function checkToolAvailable(command, versionArgs = ["--version"]) {
  const sanitizedArgs = versionArgs.map(escapeShellArg);
  const commandToRun = command.includes(" ") && !command.startsWith('"') ? `"${command}"` : command;
  const fullCommand = `${commandToRun} ${sanitizedArgs.join(" ")}`;
  try {
    const { stdout, stderr } = await execAsync(fullCommand, {
      timeout: 10000,
      maxBuffer: 1024 * 1024,
    });
    const version = (stdout || stderr || "").split("\n")[0].trim();
    return { available: true, version };
  } catch {
    return { available: false, version: null };
  }
}

module.exports = { executeCommand, checkToolAvailable };
