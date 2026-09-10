import {assessmentSvg} from './assessment.js';
import {planSvg,validate,entranceFrame,compileGeometry} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
const $=s=>document.querySelector(s);
const [base,interior]=await Promise.all(['BASE_GEOMETRY_V1.json','INTERIOR_V2.json'].map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error('모델을 읽지 못했습니다.');return validate(await r.json());}));
$('#planBefore').innerHTML=planSvg(base,{showImage:false,orientationLabel:'BASE_GEOMETRY_V1'});
$('#planAfter').innerHTML=planSvg(interior,{showImage:false,orientationLabel:'INTERIOR_V2 · 황색 구조 미확인'});
let left,right,syncing=false;
function sync(to,s){if(!to||syncing)return;syncing=true;to.setCamera(s);syncing=false;}
try{left=createShared3D($('#sceneBefore'),{onCameraChange:s=>sync(right,s)});right=createShared3D($('#sceneAfter'),{onCameraChange:s=>sync(left,s)});left.update(base);right.update(interior);left.whole();right.setCamera(left.cameraState());}catch(e){$('#evidence').textContent='3D 실행 실패: '+e.message;throw e;}
let active='after';
function single(){ $('#pair').classList.add('single');$('#before').hidden=active!=='before';$('#after').hidden=active!=='after';$('#active').textContent=active==='before'?'BEFORE · 원본 기준':'AFTER · 확장 검토';$('#toggle').textContent=active==='before'?'확장 후로 전환':'확장 전으로 전환';}
$('#toggle').onclick=()=>{active=active==='after'?'before':'after';single();};
$('#compare').onclick=()=>{$('#pair').classList.remove('single');$('#before').hidden=false;$('#after').hidden=false;$('#active').textContent='BEFORE / AFTER 나란히 비교';};
$('#overview').onclick=()=>{left.whole();right.setCamera(left.cameraState());};$('#entry').onclick=()=>{left.entrance();right.setCamera(left.cameraState());};
$('#assessmentPlan').innerHTML=assessmentSvg(interior);
for(const boundary of interior.boundaryAssessment.boundaries){const removed=boundary.segments.filter(s=>s.classification==='REMOVE_FOR_EXPANSION'),unknown=boundary.segments.filter(s=>s.classification==='STRUCTURE_UNCONFIRMED');if(removed.length){const row=document.createElement('tr');for(const value of [boundary.name,'창호 '+removed.length+'구간',unknown.length+'개 segment 미확인 (벽끝·상부·하부 분리)']){const td=document.createElement('td');td.textContent=value;row.append(td);}$('#assessmentRows').append(row);}for(const s of boundary.segments){const li=document.createElement('li');li.textContent=boundary.name+' / '+s.component+' / '+s.classification+' — '+s.evidence+' [높이 '+s.y+'~'+(s.y+s.height)+'mm, ASSUMED]';$('#structures').append(li);}}
$('#evidence').textContent='BASE_GEOMETRY_V1 원본 보존 · INTERIOR_V2 동일 좌표 · 내부 창호 5개 segment 제외 · 미확인 벽체는 윤곽선과 충돌 유지 · KEEP_STRUCTURE 확정 0건';
$('#exportPair').onclick=async()=>{$('#compare').click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const imgs=await Promise.all([left,right].map(v=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i);i.src=v.screenshot();})));const c=document.createElement('canvas');c.width=1600;c.height=660;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,1600,660);x.fillStyle='#243746';x.font='24px sans-serif';x.fillText('BEFORE · BASE_GEOMETRY_V1',20,35);x.fillText('AFTER · INTERIOR_V2',820,35);imgs.forEach((i,n)=>x.drawImage(i,n*800,55,800,550));x.font='18px sans-serif';x.fillText('동일 카메라 · 황색 선 STRUCTURE_UNCONFIRMED · 실측/구조 확인 전 검토',20,640);const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='INTERIOR_V2-3D-BEFORE-AFTER.png';a.click();};
