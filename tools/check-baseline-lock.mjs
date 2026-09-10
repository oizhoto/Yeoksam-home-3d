import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const locked='81f9035ac4737185c16acce0b76a357ba2f2cc14';
for(const p of ['dist/apartment.config.json','dist/BASE_GEOMETRY_V1.json','dist/INTERIOR_V2_SVG_EXPANSION.json','dist/FIXED_INTERIOR_V1.json','dist/plan-core.js','dist/review.js']){
  assert.deepEqual(readFileSync(p),execFileSync('git',['show',`${locked}:${p}`]));console.log('PASS unchanged:',p);
}
console.log('PASS baseline changes = 0');
