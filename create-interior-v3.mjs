import fs from 'node:fs';
import {containsPoint} from './dist/plan-core.js';
const c=JSON.parse(fs.readFileSync('dist/INTERIOR_V2.json'));
c.geometryRevision='INTERIOR_V3_EXPANSION_CLEANUP';c.parentRevision='INTERIOR_V2';c.unknownStructureDisplay='review-only';
const ids=new Set(c.boundaryAssessment.boundaries.map(b=>b.id));
c.walls=c.walls.filter(w=>!ids.has(w.id));
// The first 300 mm is an existing exterior return, outside the interior boundary scope.
const base=JSON.parse(fs.readFileSync('dist/BASE_GEOMETRY_V1.json'));
const ret=structuredClone(base.walls.find(w=>w.id==='north-step'));ret.id='north-step-exterior-return';ret.b=[5900,300];ret.external=true;ret.note='기존 외곽 0~300mm만 보존. 내력 여부 확정 아님.';c.walls.push(ret);
for(const b of c.boundaryAssessment.boundaries)for(const s of b.segments){s.geometryExists=false;s.collisionExists=false;if(b.id==='north-step'){s.a=[5900,300];s.evidence+=' 외곽 0~300mm는 확장 경계에서 제외하여 보존.';} }
c.boundaryAssessment.note='미확인 부재는 검토 데이터에만 보존. 일반 렌더·충돌에는 없음. 실제 철거 가능 판정 아님. KEEP_STRUCTURE 확정 근거 없음.';
c.expansion.policy=c.boundaryAssessment.note;
c.sourceFloorZones=structuredClone(c.floorPolygons);
// Exact orthogonal union: cancel shared cell edges, retaining all original holes.
const polys=c.floorPolygons.map(f=>f.polygon),xs=[...new Set(polys.flat(1).map(p=>p[0]))].sort((a,b)=>a-b),zs=[...new Set(polys.flat(1).map(p=>p[1]))].sort((a,b)=>a-b),edges=new Map();
const key=p=>p.join(',');function edge(a,b){const k=key(a)+'>'+key(b),rev=key(b)+'>'+key(a);if(edges.has(rev))edges.delete(rev);else edges.set(k,[a,b]);}
for(let i=0;i<xs.length-1;i++)for(let j=0;j<zs.length-1;j++){if(!polys.some(p=>containsPoint(p,[(xs[i]+xs[i+1])/2,(zs[j]+zs[j+1])/2])))continue;const a=[xs[i],zs[j]],b=[xs[i+1],zs[j]],d=[xs[i],zs[j+1]],e=[xs[i+1],zs[j+1]];edge(a,b);edge(b,e);edge(e,d);edge(d,a);}
const loops=[];while(edges.size){const first=edges.values().next().value;let cur=first[0],loop=[];do{loop.push(cur);const pair=[...edges.entries()].find(([,e])=>key(e[0])===key(cur));if(!pair)throw Error('Union boundary not closed');edges.delete(pair[0]);cur=pair[1][1];}while(key(cur)!==key(loop[0]));loop=loop.filter((p,i)=>{const a=loop[(i+loop.length-1)%loop.length],b=loop[(i+1)%loop.length];return (p[0]-a[0])*(b[1]-p[1])!==(p[1]-a[1])*(b[0]-p[0]);});loops.push(loop);}
const area=p=>p.reduce((v,a,i)=>{const b=p[(i+1)%p.length];return v+a[0]*b[1]-b[0]*a[1];},0)/2;
const outer=loops.filter(p=>area(p)>0),holes=loops.filter(p=>area(p)<0);
c.floorPolygons=outer.map((p,i)=>({id:'continuous-interior-floor-'+i,polygon:p,holes:holes.filter(h=>containsPoint(p,h[0])),level:0,levelStatus:'ASSUMED',mergedFrom:c.sourceFloorZones.map(f=>f.id),status:'ASSUMED'}));
c.expansion.floorLevelAssumption='ASSUMED: 실제 단차 자료 없음. 기존 모든 실내/발코니 바닥을 0mm 동일 높이의 연속 면으로 합침. 원본 바닥 합집합 밖은 추가하지 않음.';
c.viewpoints={living:{position:[6000,1600,8000],target:[6000,1600,11205]},kitchen:{position:[3700,1600,3400],target:[3700,1600,0]}};
fs.writeFileSync('dist/INTERIOR_V3_EXPANSION_CLEANUP.json',JSON.stringify(c,null,2));
console.log({floors:c.floorPolygons.length,holes:holes.length,walls:c.walls.length,reviewSegments:c.boundaryAssessment.boundaries.flatMap(b=>b.segments).length});
