import fs from 'node:fs';import {compileGeometry} from './dist/plan-core.js';
const base=JSON.parse(fs.readFileSync('dist/BASE_GEOMETRY_V1.json')),c=JSON.parse(fs.readFileSync('dist/INTERIOR_V1.json'));
c.geometryRevision='INTERIOR_V2';c.name='역삼푸르지오 · 발코니 경계 segment 판정';c.unknownStructureDisplay='wireframe';
const names={'bal1-living':'거실 ↔ 발코니1','bal1-bed1':'안방 ↔ 발코니1','bal2-kitchen':'주방 ↔ 발코니2','bal2-bed2':'침실2 ↔ 발코니2','bal3-inner':'침실3 ↔ 발코니3'};
const ids=c.expansion.retainedStructure;const g=compileGeometry(base);
c.boundaryAssessment={status:'DRAWING_REVIEW_NOT_DEMOLITION_APPROVAL',legend:{REMOVE_FOR_EXPANSION:'#d52d32',KEEP_STRUCTURE:'#111111',STRUCTURE_UNCONFIRMED:'#e78a19'},note:'현재 원본은 구조 도면이 아님. KEEP_STRUCTURE 확정 0건. 미확인 부재는 삭제하지 않고 3D 윤곽선과 충돌로 보존. 하부/상부벽은 기본 높이에서 생성된 가정 부재이며 원본에서 실재·높이를 확인하지 못함.',boundaries:[]};
for(const id of ids){const w=base.walls.find(w=>w.id===id),parts=g.parts.filter(p=>p.wallId===id),assessment={id,name:names[id]??w.name,segments:[]};
 for(const p of parts){const o=w.openings.find(o=>{const q=g.openings.find(q=>q.id===o.id);return JSON.stringify(q?.a)===JSON.stringify(p.a)&&JSON.stringify(q?.b)===JSON.stringify(p.b);});const glazing=p.kind==='glass'&&w.kind==='balcony-boundary';const automatic=!!o&&p.kind==='wall';assessment.segments.push({...p,id:`${id}-segment-${assessment.segments.length+1}`,classification:glazing?'REMOVE_FOR_EXPANSION':'STRUCTURE_UNCONFIRMED',component:glazing?'창호':automatic?(p.y===0?'하부벽 가정':'상부벽 가정'):'벽체/벽끝 구간',evidence:glazing?'원본의 얇은 평행 창호선. 기존 창호 범위만 모델에서 제외. 철거 승인 판단 아님.':automatic?'BASE가 공통 windowSill/windowHeight로 자동 생성. 도면에서 실재와 높이 확인 불가.':'원본의 벽체 또는 경계선. 구조재/비구조재 구분과 철거 가능 여부 확인 불가.',sourceKind:glazing?'VISIBLE_GLAZING':automatic?'GENERATED_HEIGHT_ASSUMPTION':'DRAWING_BOUNDARY_UNCONFIRMED',heightStatus:'ASSUMED',openingId:o?.id??null});}
 c.boundaryAssessment.boundaries.push(assessment);
}
c.expansion.policy='경계별 segment 판정. 확인된 내부 창호만 제외. 미확인 부재는 윤곽과 충돌을 유지하며 불투명 벽으로 단정하지 않는다.';
fs.writeFileSync('dist/INTERIOR_V2.json',JSON.stringify(c,null,2));
