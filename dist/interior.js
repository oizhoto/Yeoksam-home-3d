import {planSvg,validate,entranceFrame,compileGeometry} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
const $=s=>document.querySelector(s);
const [base,interior]=await Promise.all(['BASE_GEOMETRY_V1.json','INTERIOR_V1.json'].map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error('모델을 읽지 못했습니다.');return validate(await r.json());}));
const materials=await (await fetch('materials.json',{cache:'no-store'})).json();
let materialPreset=materials.presets.find(p=>p.id===materials.defaultPreset)||materials.presets[0];
$('#planBefore').innerHTML=planSvg(base,{showImage:false,orientationLabel:'BASE_GEOMETRY_V1'});
$('#planAfter').innerHTML=planSvg(interior,{showImage:false,orientationLabel:'INTERIOR_V1 · 황색 구조 미확인'});
let left,right,syncing=false;
function sync(to,s){if(!to||syncing)return;syncing=true;to.setCamera(s);syncing=false;}
try{left=createShared3D($('#sceneBefore'),{onCameraChange:s=>sync(right,s)});right=createShared3D($('#sceneAfter'),{onCameraChange:s=>sync(left,s)});left.update(base);right.update(interior,{materialPreset});left.whole();right.setCamera(left.cameraState());}catch(e){$('#evidence').textContent='3D 실행 실패: '+e.message;throw e;}
let active='after';
function single(){ $('#pair').classList.add('single');$('#before').hidden=active!=='before';$('#after').hidden=active!=='after';$('#active').textContent=active==='before'?'BEFORE · 원본 기준':'AFTER · 확장 검토';$('#toggle').textContent=active==='before'?'확장 후로 전환':'확장 전으로 전환';}
$('#toggle').onclick=()=>{active=active==='after'?'before':'after';single();};
$('#compare').onclick=()=>{$('#pair').classList.remove('single');$('#before').hidden=false;$('#after').hidden=false;$('#active').textContent='BEFORE / AFTER 나란히 비교';};
$('#overview').onclick=()=>{left.whole();right.setCamera(left.cameraState());};$('#entry').onclick=()=>{left.entrance();right.setCamera(left.cameraState());};
for(const id of interior.expansion.retainedStructure){const w=interior.walls.find(w=>w.id===id),li=document.createElement('li');li.textContent=w.name+' — STRUCTURE_UNCONFIRMED (벽체·잔여 하부벽·상부벽 유지)';$('#structures').append(li);}
$('#evidence').textContent='동일 좌표계 · 동일 2D/3D 데이터 · 현관 기준 거실 왼쪽 '+(entranceFrame(base).livingLeft&&entranceFrame(interior).livingLeft?'YES':'NO')+' · 발코니 3곳 실내 전환 · 내부 창호 '+interior.expansion.removedGlazing.length+'곳 제거 검토 · 구조 미확인 '+interior.expansion.retainedStructure.length+'개 경계 유지';
$('#exportPair').onclick=async()=>{$('#compare').click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const imgs=await Promise.all([left,right].map(v=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i);i.src=v.screenshot();})));const c=document.createElement('canvas');c.width=1600;c.height=660;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,1600,660);x.fillStyle='#243746';x.font='24px sans-serif';x.fillText('BEFORE · BASE_GEOMETRY_V1',20,35);x.fillText('AFTER · INTERIOR_V1',820,35);imgs.forEach((i,n)=>x.drawImage(i,n*800,55,800,550));x.font='18px sans-serif';x.fillText('동일 카메라 · 황색 선 STRUCTURE_UNCONFIRMED · 실측/구조 확인 전 검토',20,640);const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='INTERIOR_V1-3D-BEFORE-AFTER.png';a.click();};

// Stage navigation + finish preview. Furniture editing is intentionally enabled in the UI as the next design layer.
const presetSelect=$('#materialPreset');
for(const p of materials.presets){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;presetSelect.append(o);}
presetSelect.value=materialPreset.id;
function showMaterialDetail(){ $('#materialDetail').textContent=`벽: ${materialPreset.wall.label} · 바닥: ${materialPreset.floor.label}`; }
showMaterialDetail();
presetSelect.onchange=()=>{materialPreset=materials.presets.find(p=>p.id===presetSelect.value)||materials.presets[0];right.update(interior,{materialPreset});showMaterialDetail();};
for(const b of document.querySelectorAll('.stage')) b.onclick=()=>{
 document.querySelectorAll('.stage').forEach(x=>x.classList.toggle('active',x===b));
 const st=b.dataset.stage;
 if(st==='original'){active='before';single();}
 else if(st==='expansion'){active='after';single();}
 else if(st==='materials'){active='after';single();$('#materialPanel').scrollIntoView({behavior:'smooth',block:'nearest'});}
 else if(st==='furniture'){active='after';single();$('#active').textContent='가구 편집 · 다음 단계에서 이동/추가/삭제 활성화';}
 else {active='after';single();$('#active').textContent='완성안 · 설계 진행에 따라 누적';}
};
