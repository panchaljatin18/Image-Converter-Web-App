import { exec } from "child_process";

export function execPromise(command: string): Promise<{ stdout: string, stderr: string }> {
  return new Promise((resolve, reject) => {
    // Increase maxBuffer to 50MB for heavy outputs
    exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
