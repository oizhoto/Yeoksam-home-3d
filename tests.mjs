import assert from 'node:assert/strict';
import fs from 'node:fs';
import {wallParts,playerBlocked,validPlacement,validateModel} from './dist/geometry.js';
const c=JSON.parse(fs.readFileSync(new URL('./dist/apartment.config.json',import.meta.url))),f=JSON.parse(fs.readFileSync(new URL('./dist/furniture.json',import.meta.url)));const p=wallParts(c);
assert.equal(c.sourceDimensions.rightSegments.reduce((a,b)=>a+b,0),11205);assert.equal(c.sourceDimensions.overallWidthIncludingCommon-c.sourceDimensions.commonWidth,7950);
assert.equal(playerBlocked(c,p,[],5250,2975),false,'bed2 door is passable');assert.equal(playerBlocked(c,p,[],5250,2000),true,'wall blocks');assert.equal(playerBlocked(c,p,[],1000,500),true,'window blocks');assert.equal(playerBlocked(c,p,[],0,5600),true,'entry blocks');
const step=100,start=[1900,7000],queue=[start],seen=new Set([start.join(',')]);for(let i=0;i<queue.length;i++){let [x,z]=queue[i];for(const [dx,dz] of [[step,0],[-step,0],[0,step],[0,-step]]){const a=x+dx,b=z+dz,k=[a,b].join(',');if(!seen.has(k)&&!playerBlocked(c,p,[],a,b)){seen.add(k);queue.push([a,b]);}}}
for(const r of c.rooms){const b=r.rect;assert(queue.some(([x,z])=>x>b[0]+300&&x<b[2]-300&&z>b[1]+300&&z<b[3]-300),'unreachable '+r.id);}
const item={id:'a',name:'test',position:[2000,8000],size:[1500,600,1000],rotation:0};assert(validPlacement(c,p,[],item));assert(!validPlacement(c,p,[],{...item,position:[0,8000]}));assert(!validPlacement(c,p,[item],{...item,id:'b'}));validateModel({schemaVersion:1,config:c,furniture:f});assert.throws(()=>validateModel({}));const bad=structuredClone(c);bad.walls[0].openings[0].width=99999;assert.throws(()=>validateModel({schemaVersion:1,config:bad,furniture:f}));
console.log('PASS: dimension chains, door/wall/window/entry collision, all 8 areas reachable, furniture bounds/overlap, import validation. Reachable grid points: '+queue.length);
