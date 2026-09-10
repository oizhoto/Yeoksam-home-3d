import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from './dist/vendor/three.module.js';
import {mirrorConfig,compileGeometry,entranceFrame,localToWorld,blocked} from './dist/plan-core.js';
const c=JSON.parse(fs.readFileSync('dist/apartment.config.json'));
const source=mirrorConfig(c), g=compileGeometry(c), original=compileGeometry(source);
const close=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const reflected=(a,b)=>{close(a[0]+b[0],7950);close(a[1],b[1]);};
assert.equal(g.source,c);assert.equal(g.floors,c.floorPolygons);assert.equal(g.rooms,c.rooms);
for(const collection of ['parts','colliders','openings']){
  assert.equal(g[collection].length,original[collection].length);
  for(const p of g[collection]){
    const q=original[collection].find(q=>q.id===p.id);assert(q);
    for(const key of ['a','b','h','leaf'])if(p[key])reflected(p[key],q[key]);
  }
}
for(const key of ['rooms','floorPolygons','balconies'])for(const r of c[key]){
  const s=source[key].find(s=>s.id===r.id);
  r.polygon.forEach((p,i)=>reflected(p,s.polygon[i]));
  if(r.labelPosition)reflected(r.labelPosition,s.labelPosition);
  if(r.local)reflected(localToWorld(r,[321,456]),localToWorld(s,[321,456]));
}
const f=entranceFrame(c);assert(f.livingLeft);assert(!entranceFrame(source).livingLeft);
const camera=new THREE.PerspectiveCamera(c.settings.verificationFov,1,.03,100);
camera.position.set(f.outside[0]/1000,1.6,f.outside[1]/1000);
camera.lookAt(f.center[0]/1000,1.6,f.center[1]/1000);camera.updateMatrixWorld();
const r=c.rooms.find(r=>r.id==='living');
const screen=new THREE.Vector3(r.labelPosition[0]/1000,1.5,r.labelPosition[1]/1000).project(camera);
assert(screen.x<0,'Living room must project to the camera left');
assert(!blocked(c,g,f.outside),'Entry camera must not start in collision');
for(let d=-450;d<=1400;d+=30)assert(!blocked(c,g,f.center.map((v,i)=>v+f.forward[i]*d)),'Entrance path blocked');
for(let x=-200;x<8500;x+=170)for(let z=100;z<11300;z+=190)
  assert.equal(blocked(c,g,[x,z]),blocked(source,original,[7950-x,z]));
console.log(`PASS: ${g.parts.length} 3D parts, ${g.colliders.length} colliders, all polygons and local coordinates mirrored; entry path clear; camera living X=${screen.x.toFixed(3)} (left).`);
