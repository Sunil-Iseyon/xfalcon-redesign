import fs from 'fs';
import path from 'path';

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    return;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const root = process.cwd();
  const baseDir = path.join(root, 'node_modules', 'tinacms', 'src', 'lib', 'posthog');

  // Tina CLI currently imports these source paths from @tinacms/app,
  // but the published tinacms package only ships dist/. Provide minimal shims.
  const posthogShimPath = path.join(baseDir, 'posthog.ts');
  const providerShimPath = path.join(baseDir, 'posthogProvider.ts');

  ensureDir(baseDir);

  ensureFile(
    posthogShimPath,
    "export const RichTextEditorSwitchedEvent = 'rich-text-editor-switched';\n"
  );

  ensureFile(
    providerShimPath,
    [
      'export function captureEvent() {',
      '  // no-op shim used only to satisfy Tina CLI unresolved source imports in CI builds',
      '}',
      '',
    ].join('\n')
  );

  console.log('[postinstall] Tina posthog shim is ready.');
}

main();
