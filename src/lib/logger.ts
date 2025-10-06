import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'debug.log');

export function log(message: string, data?: object) {
  const timestamp = new Date().toISOString();
  let logMessage = `${timestamp} - ${message}`;
  if (data) {
    logMessage += `\n${JSON.stringify(data, null, 2)}`;
  }
  logMessage += '\n\n';

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}