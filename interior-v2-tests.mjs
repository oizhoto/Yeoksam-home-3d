import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {compileGeometry,validate} from './dist/plan-core.js';
const raw=fs.readFileSync('dist/BASE_GEOMETRY_V1.json'),base=JSON.parse(raw),c=validate(JSON.parse(fs.readFileSync('dist/INTERIOR_V2.json')));
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'8d3cd8d89bc01608b20613d10c9790578b34d5bbc9f0a737d397063a493193c1');
const segments=c.boundaryAssessment.boundaries.flatMap(b=>b.segments),g=compileGeometry(c),original=compileGeometry(base);
assert.equal(segments.filter(s=>s.classification==='REMOVE_FOR_EXPANSION').length,5);
assert.equal(segments.filter(s=>s.classification==='KEEP_STRUCTURE').length,0);
for(const s of segments){assert(['REMOVE_FOR_EXPANSION','KEEP_STRUCTURE','STRUCTURE_UNCONFIRMED'].includes(s.classification));if(s.classification==='REMOVE_FOR_EXPANSION'){assert.equal(s.kind,'glass');assert(!g.parts.some(p=>p.wallId===s.wallId&&p.kind==='glass'));}else assert(g.parts.some(p=>p.assessmentSegmentId===s.id));}
assert.deepEqual(base.bounds,c.bounds);assert.deepEqual(base.settings,c.settings);assert.deepEqual(base.entrance,c.entrance);
for(const p of original.parts.filter(p=>p.kind!=='glass'))assert(g.parts.some(q=>q.wallId===p.wallId&&q.kind===p.kind&&q.y===p.y&&q.height===p.height&&JSON.stringify(q.a)===JSON.stringify(p.a)&&JSON.stringify(q.b)===JSON.stringify(p.b)));
assert.equal(segments.filter(s=>s.sourceKind==='GENERATED_HEIGHT_ASSUMPTION').length,10);
console.log('PASS: base byte hash, full segment coverage, 5 glazing removals, 10 explicit height assumptions, all uncertain parts/colliders retained. Total segments: '+segments.length);
