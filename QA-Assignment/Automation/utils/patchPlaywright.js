import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runnerPath = path.resolve(__dirname, '../node_modules/playwright/lib/runner/index.js');

if (fs.existsSync(runnerPath)) {
  let content = fs.readFileSync(runnerPath, 'utf8');
  const target = `const entryStatus = checkIgnores(entryPath, rules, entry.isDirectory(), status);
      if (entry.isDirectory() && entryStatus !== "ignored")
        await visit(entryPath, rules, entryStatus);
      else if (entry.isFile() && entryStatus === "included")
        files.push(entryPath);`;

  const replacement = `const entryIsDirectory = entry.isDirectory() || (entry.isSymbolicLink() && import_fs2.default.statSync(entryPath).isDirectory());
      const entryIsFile = entry.isFile() || (entry.isSymbolicLink() && import_fs2.default.statSync(entryPath).isFile());
      const entryStatus = checkIgnores(entryPath, rules, entryIsDirectory, status);
      if (entryIsDirectory && entryStatus !== "ignored")
        await visit(entryPath, rules, entryStatus);
      else if (entryIsFile && entryStatus === "included")
        files.push(entryPath);`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(runnerPath, content, 'utf8');
    console.log('[patchPlaywright] Successfully applied OneDrive Dirent fix to Playwright runner.');
  } else {
    console.log('[patchPlaywright] Playwright runner is already patched or target signature not found.');
  }
}
