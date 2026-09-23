// Zero-dependency build: stitches src/ back into one self-contained page (dist/index.html).
//   node build.mjs          -> writes dist/index.html
//   node build.mjs --check  -> also syntax-checks the combined script
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const read = p => readFileSync(new URL(`./src/${p}`, import.meta.url), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const css = manifest.styles.map(read).join('\n');
const js = manifest.scripts.map(read).join('\n');
const html = read('index.template.html').replace('/*__STYLES__*/', () => css).replace('/*__SCRIPTS__*/', () => js);
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/index.html', import.meta.url), html);
if (process.argv.includes('--check')) {
  writeFileSync(new URL('./dist/app.check.js', import.meta.url), js);
  execFileSync(process.execPath, ['--check', new URL('./dist/app.check.js', import.meta.url).pathname], { stdio: 'inherit' });
  console.log('Syntax OK');
}
console.log(`Built dist/index.html (${(html.length / 1024).toFixed(1)} kB, ${manifest.scripts.length} script modules)`);
