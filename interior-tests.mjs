import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {compileGeometry,validate} from './dist/plan-core.js';
const raw=fs.readFileSync('dist/BASE_GEOMETRY_V1.json'),a=JSON.parse(raw),b=validate(JSON.parse(fs.readFileSync('dist/INTERIOR_V1.json')));
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'8d3cd8d89bc01608b20613d10c9790578b34d5bbc9f0a737d397063a493193c1');
assert.equal(b.baseSha256,crypto.createHash('sha256').update(raw).digest('hex'));
assert.deepEqual(a.bounds,b.bounds);assert.deepEqual(a.settings,b.settings);assert.deepEqual(a.entrance,b.entrance);
for(const r of a.rooms){const s=b.rooms.find(s=>s.id===r.id);assert.deepEqual(r.polygon,s.polygon);assert.deepEqual(r.local,s.local);}
const ga=compileGeometry(a),gb=compileGeometry(b);
// Every solid original part survives unchanged; only the five inner glazing panels disappear.
for(const p of ga.parts.filter(p=>p.kind!=='glass'))assert(gb.parts.some(q=>q.wallId===p.wallId&&q.kind===p.kind&&q.y===p.y&&q.height===p.height&&JSON.stringify(q.a)===JSON.stringify(p.a)&&JSON.stringify(q.b)===JSON.stringify(p.b)));
assert.equal(ga.parts.filter(p=>p.kind==='glass').length-gb.parts.filter(p=>p.kind==='glass').length,5);
assert(b.balconies.every(b=>b.status==='EXPANDED_INTERIOR_CONCEPT'));assert.equal(b.balconies.length,3);
console.log('PASS: immutable baseline hash, same coordinates/camera, all solid wall portions retained, only five inner glazing panels removed, three indoor balcony zones.');
