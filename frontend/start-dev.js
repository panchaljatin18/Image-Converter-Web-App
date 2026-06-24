const { spawn } = require('child_process');

console.log("Starting Next.js and BullMQ Worker concurrently...");

const next = spawn('npm', ['run', 'next-dev'], { stdio: 'inherit', shell: true });
const worker = spawn('npm', ['run', 'worker'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  next.kill('SIGINT');
  worker.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  next.kill('SIGTERM');
  worker.kill('SIGTERM');
  process.exit();
});
