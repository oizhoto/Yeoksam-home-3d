import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const parent='c57742bed8efeb90008fade715fceb4f6a3ae80c';
const read=p=>readFileSync(p,'utf8');
const old=p=>execFileSync('git',['show',`${parent}:${p}`],{maxBuffer:64*1024*1024});
const allowed=new Set(['dist/materials.js','dist/index.html','dist/interior.js','dist/shared-3d.js','PROJECT_STATE.md']);
const tracked=execFileSync('git',['ls-tree','-r','--name-only',parent],{encoding:'utf8'}).trim().split('\n');
let count=0;
for(const p of tracked)if(!allowed.has(p)){assert.deepEqual(readFileSync(p),old(p),`Protected file changed: ${p}`);count++;}
assert.equal(read('dist/shared-3d.js'),old('dist/shared-3d.js').toString().replace("APP_VERSION='V8.23'","APP_VERSION='V8.24'"));
assert.equal(read('dist/index.html'),old('dist/index.html').toString().replaceAll('V8.23','V8.24').replace('2026-09-11 00:13 KST','2026-09-11 06:15 KST'));
assert.equal(read('dist/interior.js'),old('dist/interior.js').toString().replace("V8.23 · 실제 싱크 상판 타공 + 디테일 하부장/식세기 + 욕실2 수건 + 벽 1/2 보기 옵션이 적용됩니다.","V8.24 · 확정 마감재 질감 개선 검토안 · 기존 V8.23 구조와 인테리어 배치 유지."));
const lock=s=>s.slice(s.indexOf('## Current baseline'),s.indexOf('## Editable layer progress'));
assert.equal(lock(read('PROJECT_STATE.md')),lock(old('PROJECT_STATE.md').toString()));
console.log(`PASS: ${count} existing files byte-identical; UI changes confined to version/copy.`);
for(const p of ['dist/BASE_GEOMETRY_V1.json','dist/INTERIOR_V2_SVG_EXPANSION.json','dist/DESIGN_V1.json'])console.log(`${p}: ${createHash('sha256').update(readFileSync(p)).digest('hex')}`);

// Exercise the real Three.js material module with a pixel-buffer canvas adapter.
// This validates maps/UV scale/API, NOT GPU appearance or WebGL shader compilation.
globalThis.document={createElement(tag){assert.equal(tag,'canvas');const c={width:0,height:0};c.getContext=()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:p=>{c.pixels=p.data;}});return c;}};
const threeUrl=new URL('../dist/vendor/three.module.js',import.meta.url).href;
const source=read('dist/materials.js').replace("from 'three'",`from '${threeUrl}'`);
const {createFinishLibrary,MATERIAL_V1,materialForBox}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const library=createFinishLibrary({capabilities:{getMaxAnisotropy:()=>4}});
const floor=library.floorMaterial('living',{}),wall=library.wall,film=library.film;
assert.deepEqual(MATERIAL_V1.floor.boardMeters,[.81,.325]);
assert.equal(floor.map.repeat.x,1/1.62);assert.equal(floor.map.repeat.y,1/.65);
for(const m of [floor,wall,film]){
  assert(m.isMeshStandardMaterial);assert.equal(m.metalness,0);
  for(const key of ['map','bumpMap','roughnessMap']){
    assert(m[key]);assert.equal(m[key].anisotropy,4);
    const px=m[key].image.pixels;let min=255,max=0;
    for(let i=0;i<px.length;i+=4){min=Math.min(min,px[i]);max=Math.max(max,px[i]);}
    assert(max>min,`${key} must not be flat`);
  }
}
const pixel=(t,x,y)=>t.image.pixels[(y*t.image.width+x)*4];
assert(pixel(floor.map,0,128)<pixel(floor.map,256,128)-10,'Joint must retain color contrast');
assert(pixel(floor.bumpMap,0,128)<pixel(floor.bumpMap,256,128)-40,'Joint needs aligned height depression');
assert.notEqual(film.bumpMap.image,wall.bumpMap.image,'Film must have independent fine grain');
assert(film.roughness<floor.roughness&&floor.roughness<wall.roughness);
const box=materialForBox(wall,2,2.3,.15,MATERIAL_V1.wall.tileMeters);
assert.equal(box[4].map.repeat.x,8);assert.equal(box[4].map.repeat.y,9.2);
for(const id of ['bath1','bath2','entry','bal1'])assert.equal(library.floorMaterial(id,{}).map,null,`${id} finish must remain unchanged`);
console.log('PASS: deterministic non-flat maps, aligned joints, 810x325mm board scale, distinct film, excluded floors, box UV scale.');
console.log('NOT VERIFIED: actual WebGL material appearance. Cloud browser WebGL is disabled.');
