const { exec } = require("child_process");

exec("magick -version", (error, stdout, stderr) => {
  if (error) {
    console.error("❌ ImageMagick is NOT installed or not found in PATH.");
    console.error(error.message);
    return;
  }

  console.log("✅ ImageMagick Connected Successfully");
  console.log(stdout);
});
