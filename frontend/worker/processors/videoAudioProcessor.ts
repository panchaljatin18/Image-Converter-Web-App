import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { Job as JobModel } from "../../src/models/Job";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export async function processVideoAudio(inputPath: string, outputPath: string, targetFormat: string, job: any): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    // Audio extraction or conversion
    const audioFormats = ["mp3", "wav", "flac", "ogg", "m4a", "aac", "ac3", "wma"];
    const isAudioTarget = audioFormats.includes(targetFormat.toLowerCase());

    if (isAudioTarget) {
        command = command.noVideo();
        if (targetFormat.toLowerCase() === "mp3") {
            command = command.audioCodec("libmp3lame").audioBitrate("192k");
        } else if (targetFormat.toLowerCase() === "ogg") {
            command = command.audioCodec("libvorbis");
        } else if (targetFormat.toLowerCase() === "m4a") {
            command = command.audioCodec("aac").audioBitrate("192k");
        }
    } else {
        // Video
        if (targetFormat.toLowerCase() === "mp4") {
            command = command.videoCodec("libx264").audioCodec("aac");
        } else if (targetFormat.toLowerCase() === "webm") {
            command = command.videoCodec("libvpx-vp9").audioCodec("libopus");
        }
    }

    let lastReportTime = Date.now();

    command
      .on("progress", async (progress) => {
        // Throttle DB updates to every 2 seconds
        if (Date.now() - lastReportTime > 2000 && progress.percent) {
          lastReportTime = Date.now();
          // Scale ffmpeg progress (0-100) to our 10-90 range
          const scaledProgress = Math.round(10 + (progress.percent * 0.8));
          await JobModel.findByIdAndUpdate(job.data.jobId, { progress: Math.min(scaledProgress, 90) });
        }
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .save(outputPath);
  });
}
