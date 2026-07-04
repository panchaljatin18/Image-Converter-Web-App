/**
 * services/ffmpegService.js  [STUB — Future Ready]
 *
 * FFmpeg CLI wrapper for video and audio conversion.
 *
 * To activate:
 *   1. Install FFmpeg: apt install ffmpeg  (or set FFMPEG_COMMAND env)
 *   2. Implement convertVideo() and convertAudio() below
 *   3. Add routes to convertRoutes.js
 *
 * Command: resolved from FFMPEG_COMMAND env (default: "ffmpeg").
 * All args must be passed as arrays to executeCommand() — never concatenate.
 */

const TOOLS  = require("../config/tools");
const logger = require("../utils/logger");

const ffmpegService = {
  /**
   * TODO: Convert video to a target format.
   * @param {string} inputPath
   * @param {string} originalName
   * @param {string} targetFormat  - e.g. "mp4", "webm", "avi"
   * @param {object} [options]     - codec, bitrate, resolution, etc.
   */
  async convertVideo(inputPath, originalName, targetFormat, options = {}) {
    throw new Error("FFmpeg video conversion not yet implemented. See services/ffmpegService.js.");
  },

  /**
   * TODO: Extract audio or convert audio format.
   * @param {string} inputPath
   * @param {string} originalName
   * @param {string} targetFormat  - e.g. "mp3", "aac", "flac"
   */
  async convertAudio(inputPath, originalName, targetFormat) {
    throw new Error("FFmpeg audio conversion not yet implemented. See services/ffmpegService.js.");
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.FFMPEG, ["-version"]);
  },
};

module.exports = ffmpegService;
