import fs from 'node:fs';
import crypto from 'node:crypto';
const baseBytes=fs.readFileSync('dist/BASE_GEOMETRY_V1.json');
const base=JSON.parse(baseBytes),c=structuredClone(base);
c.geometryRevision='INTERIOR_V4_EVIDENCE_BOUND_EXPANSION';c.parentRevision='BASE_GEOMETRY_V1';c.name='역삼푸르지오 · 근거 기반 발코니 확장';
Object.assign(c.rooms.find(r=>r.id==='bal1'),{name:'침실1 전용 베란다'});Object.assign(c.rooms.find(r=>r.id==='bal2'),{name:'주방·침실2 확장부'});Object.assign(c.rooms.find(r=>r.id==='bal3'),{name:'발코니3 · BASE 보존'});
c.researchBasis={sources:[
 {id:'same-complex-24p-ohouse-2023',url:'https://contents.ohou.se/projects/143970',finding:'동일 단지 24평 시공사례. 거실 라운드창을 직선형으로 변경한 사례 확인.'},
 {id:'same-complex-contractor',url:'https://johnnieclassic.com/apt/yeoksam-prugio',finding:'동일 단지 24평 3룸/욕실2 및 좁은 주방 구조 확인. 개별 벽체 철거 근거는 제공하지 않음.'}
],method:'동일 단지 자료에서 확인 가능한 발코니 확장·거실 외창 사례만 반영. 개별 구조벽/기둥의 철거 여부는 확인하지 못해 BASE 보존.'};
const removable=new Map([
 ['bal1-living',{name:'거실 ↔ 발코니1',reason:'BASE의 기존 유리 개구부(glaze-living)와 동일 단지 24평 거실 확장·외창 사례로 확인된 창호 조립체.',ends:[[7950,9555],[7850,9555],[3900,9555],[3800,9555]]}],
 ['bal2-kitchen',{name:'주방 ↔ 발코니2',reason:'BASE의 기존 유리 개구부(glaze-kitchen). 주방 확장부 편입은 요청 사항이며 벽끝만 보존.',ends:[[4550,1785],[4500,1785],[2750,1785],[2700,1785]]}],
 ['bal2-bed2',{name:'침실2 ↔ 발코니2',reason:'BASE의 기존 유리 개구부(glaze-bed2). 침실2 확장은 요청 사항이며 벽끝만 보존.',ends:[[2700,1325],[2550,1325],[200,1325],[0,1325]]}]
]);
const keep=[];c.walls=c.walls.filter(w=>!removable.has(w.id));
for(const [id,x] of removable){const original=base.walls.find(w=>w.id===id);for(const [n,a,b] of [['a',x.ends[0],x.ends[1]],['b',x.ends[2],x.ends[3]]]){c.walls.push({id:`${id}-retained-${n}`,name:`${x.name} 벽끝 보존 ${n}`,a,b,external:false,thickness:original.thickness,kind:'wall',openings:[],evidence:'BASE_RETAINED_UNCERTAIN',note:'창호 양끝의 비창호 구간. 구조체 여부 미확정이므로 BASE 위치·길이를 보존.',positionStatus:'BASE_RETAINED',thicknessStatus:'BASE_RETAINED'});keep.push({id:`${id}-retained-${n}`,a,b,classification:'UNCERTAIN_STRUCTURE_OR_BOUNDARY',geometry:true,reason:'창호가 아닌 BASE 잔여 벽끝. 자료만으로 철거 근거 없음.'});}}
const retained=[
 ['bal1-bed1','침실1 ↔ 작은 베란다','침실1은 미확장. BASE의 전체 유리 경계와 외창을 유지하며, 접근용 창호의 세부 개폐 방식은 UNRESOLVED.'],
 ['bal1-divider','거실 확장부 ↔ 침실1 전용 베란다','침실1 전용 베란다를 분리하는 BASE 측면 경계 보존.'],
 ['bal3-inner','침실3 ↔ 발코니3','침실3 확장 근거 없음. BASE 보존.'],['north-step','발코니2/3 및 외곽 단차','확장 범위와 무관하며 구조 여부 미확정. BASE 보존.'],['shaft-bottom','상단 설비 박스','구조·설비 여부 미확정. BASE 보존.'],['shaft-top','상단 설비 박스','구조·설비 여부 미확정. BASE 보존.'],['shaft-right','상단 설비 박스','구조·설비 여부 미확정. BASE 보존.']
];
for(const [id,name,reason] of retained){const w=base.walls.find(w=>w.id===id);keep.push({id,name,a:w.a,b:w.b,classification:'UNCERTAIN_STRUCTURE_OR_BOUNDARY',geometry:true,reason});}
const flat=f=>structuredClone(base.floorPolygons.find(x=>x.id===f));
c.floorPolygons=base.floorPolygons.filter(f=>!['floor-bal1','floor-bal2'].includes(f.id)).map(f=>structuredClone(f));
// These rectangles cover only the original balcony zones. They add no new area or floor-level change.
c.floorPolygons.push(
 {id:'floor-living-balcony1-expanded',roomId:'living',polygon:[[7950,9555],[3800,9555],[3800,11205],[7950,11205]],status:'CONFIRMED_EXPANSION',level:0,levelStatus:'ASSUMED_SAME_LEVEL',mergedWith:'floor-living'},
 {id:'floor-kitchen-bed2-balcony2-expanded',roomId:'kitchen',polygon:flat('floor-bal2').polygon,status:'CONFIRMED_EXPANSION',level:0,levelStatus:'ASSUMED_SAME_LEVEL',mergedWith:'floor-kitchen,floor-bed2'},
 {id:'floor-bed1-private-balcony',roomId:'bal1',polygon:[[3800,9955],[0,9955],[0,11205],[3800,11205]],status:'BASE_RETAINED_UNEXPANDED',level:0,levelStatus:'ASSUMED_SAME_LEVEL'}
);
c.viewpoints={living:{position:[6000,1600,8000],target:[6000,1600,11205]},kitchen:{position:[3700,1600,3400],target:[3700,1600,0]},bed2:{position:[1350,1600,2600],target:[1350,1600,200]},bed1:{position:[1900,1600,8500],target:[1900,1600,10800]}};
c.extensions={living:{status:'CONFIRMED_EXPANSION',floor:'floor-living-balcony1-expanded'},kitchenBed2:{status:'CONFIRMED_EXPANSION',floor:'floor-kitchen-bed2-balcony2-expanded'},bed1:{status:'BASE_RETAINED_UNEXPANDED',floor:'floor-bed1-private-balcony'},bed3:{status:'UNRESOLVED_BASE_RETAINED',floor:'floor-bal3'}};
c.boundaryAssessment={version:'V4_EVIDENCE_BOUND',legend:{CONFIRMED_REMOVABLE_GLAZING_FRAME:'#d52d32',CONFIRMED_STRUCTURE:'#111111',UNCERTAIN_STRUCTURE_OR_BOUNDARY:'#e78a19'},segments:[...Array.from(removable,([id,x])=>({id,a:base.walls.find(w=>w.id===id).a,b:base.walls.find(w=>w.id===id).b,classification:'CONFIRMED_REMOVABLE_GLAZING_FRAME',geometry:false,collision:false,reason:x.reason})),...keep],unresolved:['침실1 베란다 창호의 정확한 개폐방식·분할','침실3 발코니 확장 가능 여부','각 벽끝/설비박스의 구조체 여부']};
c.protection={baseSha256:crypto.createHash('sha256').update(baseBytes).digest('hex'),lockedBaseElements:['entry','bath1','bath2','bed3-east','bed3-south','spine','bed2-south','bath-divider','bed1-north','bed1-west'],rule:'발코니 확장과 직접 관계 없는 BASE geometry를 변경하지 않음.'};
fs.writeFileSync('dist/INTERIOR_V4_EVIDENCE_BOUND_EXPANSION.json',JSON.stringify(c,null,2));
