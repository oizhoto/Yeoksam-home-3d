import fs from 'node:fs';
const j=JSON.parse(fs.readFileSync('dist/BATHROOM_KITCHEN_V1.json','utf8'));
const state=fs.readFileSync('PROJECT_STATE.md','utf8');
const index=fs.readFileSync('dist/index.html','utf8');
const protectedFiles=[
  'dist/BASE_GEOMETRY_V1.json',
  'dist/INTERIOR_V2_SVG_EXPANSION.json',
  'dist/apartment.config.json',
  'dist/DESIGN_V1.json'
];
const missing=[];
if(j.projectVersion!=='V8.25') missing.push('BATHROOM_KITCHEN projectVersion');
if(j.baselineVersion!=='V7.5 BASELINE LOCKED') missing.push('baseline marker');
if(!Array.isArray(j.referenceDetails)||j.referenceDetails.length<4) missing.push('referenceDetails');
if(!state.includes('V8.25 — REFERENCE BUILT-INS / BATH DETAIL')) missing.push('PROJECT_STATE version');
if(!index.includes('Yeoksam Digital Twin · V8.25')) missing.push('screen version');
if(missing.length){console.error('FAIL:',missing.join(', '));process.exit(1);}
console.log('PASS V8.25 metadata/data checks');
console.log('Protected geometry/design files are intentionally absent from this patch:');
for(const f of protectedFiles) console.log(' -',f);
