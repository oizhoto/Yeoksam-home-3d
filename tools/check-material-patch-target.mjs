// Run from the TARGET repository root, BEFORE copying ZIP files into it.
// Safe preflight only: no files are written, no git commands or network requests.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const expected={
  'PROJECT_STATE.md':'906c1715f07495987d0b1c7492cf9ede97294c06',
  'dist/index.html':'61428e24815f7379a9209d9c04c871d6a056e185',
  'dist/interior.js':'7c6e39d9ca45e1eff880bd708a33dd189a7cc9dc',
  'dist/materials.js':'39da50fac17bc2455d41fb0f5720d22d8c1575ea',
  'dist/shared-3d.js':'17605655310add0a44c0e6d865abfda3a54ad9cb'
};
let failed=false;
for(const [path,want] of Object.entries(expected)){
  let actual='MISSING';try{const bytes=readFileSync(path);actual=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');}catch{}
  const ok=actual===want;failed ||= !ok;
  console.log(`${ok?'PASS':'CONFLICT'} ${path}`);
}
if(failed){console.error('Do not overwrite target files. Inspect and merge individual changes against latest main.');process.exitCode=1;}
else console.log('Target matches V8.23 patch base. Review patch before applying.');
