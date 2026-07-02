import { copyFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

if (!existsSync('apiKeys.json')) {
  copyFileSync('apiKeys.start.json', 'apiKeys.json');
}

const server = spawn(process.execPath, ['src/api-server.js'], {
  stdio: 'inherit'
});

server.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});