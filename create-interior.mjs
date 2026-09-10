import fs from 'node:fs';import crypto from 'node:crypto';
const raw=fs.readFileSync('dist/BASE_GEOMETRY_V1.json');const c=JSON.parse(raw);
c.geometryRevision='INTERIOR_V1';c.name='역삼푸르지오 2호 라인 · 발코니 전체 확장 검토';c.baseGeometryId='BASE_GEOMETRY_V1';c.baseSha256=crypto.createHash('sha256').update(raw).digest('hex');c.stage='발코니 확장 검토';
c.expansion={status:'CONCEPT_STRUCTURE_PENDING',scope:['bal1','bal2','bal3'],policy:'기존 내부 창호만 제거한 확장 검토안. 철거 미확인 벽체·하부벽·상부벽·기둥은 유지. 바닥 레벨은 기존 가정 0mm 유지.',removedGlazing:[],retainedStructure:[]};
for(const w of c.walls){if(w.kind==='balcony-boundary'||w.id==='bal1-divider'||w.id.startsWith('shaft-')||w.id==='north-step'){
 w.structureStatus='STRUCTURE_UNCONFIRMED';w.demolition='RETAIN_PENDING_VERIFICATION';c.expansion.retainedStructure.push(w.id);
 if(w.kind==='balcony-boundary')for(const o of w.openings){if(o.type==='window'){o.removeGlazing=true;o.expansionStatus='GLAZING_REMOVED_CONCEPT';o.structureStatus='STRUCTURE_UNCONFIRMED';c.expansion.removedGlazing.push(o.id);}}
}}
for(const b of c.balconies){b.status='EXPANDED_INTERIOR_CONCEPT';b.structureStatus='STRUCTURE_UNCONFIRMED';}
for(const r of c.rooms)if(r.id.startsWith('bal')){r.originalName=r.name;r.name='확장 실내 '+r.id.slice(3);r.usage='interior';r.expanded=true;r.structureStatus='STRUCTURE_UNCONFIRMED';}
for(const f of c.floorPolygons)if(f.roomId.startsWith('bal')){f.usage='interior';f.level=0;f.levelStatus='ASSUMED';}
fs.writeFileSync('dist/INTERIOR_V1.json',JSON.stringify(c,null,2));
