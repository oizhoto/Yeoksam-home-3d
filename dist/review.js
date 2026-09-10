import {createShared3D} from './shared-3d.js';
import {planSvg,validate,openingPoints,mirrorConfig,entranceFrame} from './plan-core.js';
const $=s=>document.querySelector(s);let config,previous,assumptions;
try{[config,previous,assumptions]=await Promise.all(['apartment.config.json','previous.config.json','assumptions.json'].map(async f=>{const r=await fetch(f,{cache:"no-store"});if(!r.ok)throw Error('설정 파일을 읽지 못했습니다.');return r.json();}));validate(config);}catch(e){$('#drawing').textContent=e.message;throw e;}

/*
 * V7.1 TEMPORARY DOOR REVIEW CANDIDATE
 * 원본 JSON 자체는 아직 확정 수정하지 않는다.
 * review 화면에서만 사용자 캡처 기준 후보 좌표를 적용하고,
 * overlay 확인 후 OK를 받으면 원본 geometry에 최종 반영한다.
 */
function applyDoorReviewCandidate(c){
  const bath1Wall=c.walls.find(w=>w.id==='spine');
  const bath1=bath1Wall?.openings.find(o=>o.id==='door-bath1');
  if(bath1){
    // spine: z가 아래로 증가하므로 start 감소 = 화면에서 위쪽 이동
    bath1.start=3195;
    bath1.width=650;
    bath1.hinge='end';
    bath1.swing=-90;
    bath1.evidence='user-reviewed-image-estimated';
    bath1.status='ASSUMED';
    bath1.note='V7.1 검토 후보: 원본 overlay 기준 욕실1 문을 기존보다 약 100mm 위로 이동. 폭/힌지/열림 방향은 유지. 실측 전.';
  }

  const bath2Wall=c.walls.find(w=>w.id==='bed1-north');
  const bath2=bath2Wall?.openings.find(o=>o.id==='door-bath2');
  if(bath2){
    // bed1-north: a=(3800,6720) -> b=(0,6720).
    // start 감소 = 화면 오른쪽(x 증가)으로 이동.
    bath2.start=2450;
    bath2.width=650;
    // 사용자 지시: 좌우반전
    bath2.hinge='end';
    bath2.swing=-90;
    bath2.evidence='user-reviewed-image-estimated';
    bath2.status='ASSUMED';
    bath2.note='V7.1 검토 후보: 욕실2 문을 화면 오른쪽으로 약 100mm 이동하고 좌우반전. bed1-north 기준 start=2450, hinge=end, swing=-90. 실측 전.';
  }

  c.geometryRevision='DOOR_REVIEW_CANDIDATE_V7_1';
  return c;
}
config=applyDoorReviewCandidate(config);
validate(config);

let scene3d;try{scene3d=createShared3D($('#shared3d'));$('#threeLoading').hidden=true;}catch(e){$('#threeLoading').textContent='WebGL 실행 실패: '+e.message;}
const defaults=structuredClone(config.review.overlay),history=[];let selected=config.walls[0].id,dirty=false,view=[-1000,-900,9950,13200];
function toast(s){$('#toast').textContent=s;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',4000);}
function checkpoint(){history.push(structuredClone(config));if(history.length>40)history.shift();dirty=true;}
function resolve(id){for(const w of config.walls){if(w.id===id)return {w};const o=w.openings.find(o=>o.id===id);if(o)return {w,o};}return {w:config.walls[0]};}
function render(){const source1=mirrorConfig(config);$('#sourceDrawing').innerHTML=planSvg(source1,{showImage:false,orientationLabel:'1호 라인'});scene3d?.update(config);const f=entranceFrame(config);$('#directionCheck').textContent=f.livingLeft?'← 거실 · 현관에서 집 안을 보는 기준':'거실 방향 검증 실패';$('#sharedEvidence').textContent='2D / 3D 데이터: '+config.geometryRevision+' · 동일 객체 '+(scene3d?.source()===config?'YES':'NO')+' · 현관 기준 거실 왼쪽 '+(f.livingLeft?'YES':'NO'); $('#drawing').innerHTML=planSvg(config,{showImage:$('#showImage').checked,showOld:$('#showOld').checked,previous,selected,roomNames:$('#names').checked,viewBox:view.join(' ')}); }
function fillOverlay(){for(const k of ['scale','rotation','offsetX','offsetY','opacity'])$('#'+k).value=config.review.overlay[k];$('#opacityValue').textContent=Math.round(config.review.overlay.opacity*100)+'%';}
function fillSelect(){const s=$('#element');s.replaceChildren();for(const w of config.walls){s.add(new Option(w.name,w.id));for(const o of w.openings)s.add(new Option('　'+(o.type==='door'?'문':'창/유리')+' · '+o.id,o.id));}s.value=selected;}
function fillElement(){const {w,o}=resolve(selected);$('#wallFields').hidden=!!o;$('#openingFields').hidden=!o;$('#elementNote').textContent=((o??w).status??w.positionStatus??'ASSUMED')+' · '+(o??w).note+' / '+({'dimension-constrained':'표기 치수로 구속','image-estimated':'이미지 추정','user-edited':'사용자 수정 · 미실측','user-reviewed-image-estimated':'사용자 캡처 검토 · 미실측'}[(o??w).evidence]??'확인 필요');if(o){$('#start').value=o.start;$('#width').value=o.width;$('#doorFields').hidden=o.type!=='door';if(o.type==='door'){$('#hinge').value=o.hinge;$('#swing').value=o.swing;}const p=openingPoints(w,o);$('#openingCoords').textContent=`양 끝점 (${p.a.map(Math.round).join(', ')}) → (${p.b.map(Math.round).join(', ')}) mm`; }else{for(const [id,value] of Object.entries({ax:w.a[0],az:w.a[1],bx:w.b[0],bz:w.b[1],thickness:w.thickness}))$('#'+id).value=value;$('#wallLength').textContent='벽 길이 '+Math.round(Math.hypot(w.b[0]-w.a[0],w.b[1]-w.a[1])).toLocaleString()+' mm';}$('#element').value=selected;}
function choose(id){selected=id;fillElement();render();}
function fillAudit(){$('#audit').replaceChildren();for(const a of config.review.checks){const tr=document.createElement('tr');for(const t of [a.space,a.before,a.sourceLine1]){const td=document.createElement('td');td.textContent=t;tr.append(td);}const td=document.createElement('td'),input=document.createElement('input');input.placeholder='틀린 위치 / 수정할 치수';input.value=a.userNote??'';input.setAttribute('aria-label',a.space+' 검토 메모');input.onchange=()=>{checkpoint();config.review.checks.find(v=>v.id===a.id).userNote=input.value;};td.append(input);tr.append(td);$('#audit').append(tr);}}
for(const d of config.dimensionEvidence){const p=document.createElement('p'),b=document.createElement('b');b.textContent=d.id+' · '+d.meaning;p.append(b,document.createTextNode(d.formula??JSON.stringify(d.value)+' mm'));$('#evidence').append(p);}
for(const a of assumptions.items){const p=document.createElement('p');p.textContent=a.id+' · '+a.subject+' — '+a.detail;$('#assumptions').append(p);}
for(const k of ['scale','rotation','offsetX','offsetY','opacity'])$('#'+k).addEventListener('input',()=>{const value=Number($('#'+k).value);if(!Number.isFinite(value))return;const candidate=structuredClone(config);candidate.review.overlay[k]=value;try{validate(candidate);}catch{return;}config=candidate;dirty=true;$('#opacityValue').textContent=Math.round(config.review.overlay.opacity*100)+'%';render();});
$('#resetOverlay').onclick=()=>{checkpoint();config.review.overlay=structuredClone(defaults);fillOverlay();render();};for(const k of ['showImage','showOld','names'])$('#'+k).onchange=render;
$('#element').onchange=e=>choose(e.target.value);$('#apply').onclick=()=>{const n=structuredClone(config),{w,o}=resolve(selected);const nw=n.walls.find(v=>v.id===w.id);if(o){const no=nw.openings.find(v=>v.id===o.id);Object.assign(no,{start:+$('#start').value,width:+$('#width').value,evidence:'user-edited'});if(o.type==='door')Object.assign(no,{hinge:$('#hinge').value,swing:+$('#swing').value});}else Object.assign(nw,{a:[+$('#ax').value,+$('#az').value],b:[+$('#bx').value,+$('#bz').value],thickness:+$('#thickness').value,evidence:'user-edited'});try{validate(n);n.baseGeometryId=config.baseGeometryId??'BASE_GEOMETRY_V1';n.geometryRevision='WORKING_COPY';if(o)nw.openings.find(v=>v.id===o.id).status='ASSUMED';else nw.positionStatus='ASSUMED';checkpoint();config=n;fillElement();render();toast('좌표를 적용했어요. 표기 치수와의 일치 여부는 원본에서 확인해 주세요.');}catch(e){toast(e.message);}};
$('#undo').onclick=()=>{if(!history.length)return toast('취소할 좌표 수정이 없어요.');config=history.pop();selected=config.walls.some(w=>w.id===selected||w.openings.some(o=>o.id===selected))?selected:config.walls[0].id;dirty=true;fillOverlay();fillSelect();fillElement();fillAudit();render();};
function zoom(f){const w=view[2]*f,h=view[3]*f;if(w<2000||w>40000)return;view=[view[0]+(view[2]-w)/2,view[1]+(view[3]-h)/2,w,h];render();}$('#zoomIn').onclick=()=>zoom(.8);$('#zoomOut').onclick=()=>zoom(1.25);$('#fit').onclick=()=>{view=[-1000,-900,9950,13200];render();};
let pan=null;$('#drawing').onpointerdown=e=>{if(e.button!==0)return;pan={x:e.clientX,y:e.clientY,view:[...view],id:e.target.closest('[data-id]')?.dataset.id,moved:false};$('#drawing').setPointerCapture(e.pointerId);};$('#drawing').onpointermove=e=>{if(!pan)return;const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)<5&&!pan.moved)return;pan.moved=true;const rect=$('#drawing').getBoundingClientRect(),s=Math.max(pan.view[2]/rect.width,pan.view[3]/rect.height);view=[pan.view[0]-dx*s,pan.view[1]-dy*s,pan.view[2],pan.view[3]];render();};$('#drawing').onpointerup=()=>{if(pan&&!pan.moved&&pan.id)choose(pan.id);pan=null;};$('#drawing').onpointercancel=()=>pan=null;
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#export').onclick=()=>download('apartment.config.json',JSON.stringify(config,null,2),'application/json');$('#save').onclick=()=>{try{localStorage.setItem('yeoksam-review-v2',JSON.stringify(config));dirty=false;toast('정렬·좌표·검토 메모를 이 브라우저에 저장했어요.');}catch{toast('저장 공간을 사용할 수 없어요. JSON 내보내기를 사용하세요.');}};
function restore(c){validate(c);if(!c.floorPolygons?.length||!c.entrance||!c.rooms.every(r=>r.polygon&&r.local&&r.labelPosition))throw Error('이 저장본은 이전 2D 전용 데이터입니다. 현재 3D 검토안에서 다시 저장해 주세요.');if(dirty&&!confirm('저장하지 않은 수정 내용을 바꾸고 불러올까요?'))return;checkpoint();config=structuredClone(c);selected=config.walls[0].id;dirty=false;fillOverlay();fillSelect();fillElement();fillAudit();render();toast('STEP 1 검토안을 불러왔어요.');}
$('#load').onclick=()=>{try{const s=localStorage.getItem('yeoksam-review-v2');if(!s)return toast('저장한 STEP 1 검토안이 없어요.');restore(JSON.parse(s));}catch(e){toast(e.message);}};$('#import').onclick=()=>$('#file').click();$('#file').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>2e6)throw Error('2MB 이하 JSON을 선택하세요.');restore(JSON.parse(await f.text()));}catch(e){toast(e.message);}finally{e.target.value='';}};
$('#svgExport').onclick=async()=>{try{const blob=await(await fetch('floorplan.png')).blob(),data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});download('line2-plan-review.svg',planSvg(config,{imageHref:data,showImage:$('#showImage').checked,showOld:$('#showOld').checked,previous,roomNames:$('#names').checked}),'image/svg+xml');}catch{toast('도면 내보내기에 실패했어요.');}};window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
fillOverlay();fillSelect();fillElement();fillAudit();render();

$('#entryView').onclick=()=>scene3d?.entrance();$('#wholeView').onclick=()=>scene3d?.whole();$('#capture3d').onclick=()=>{if(!scene3d)return;const a=document.createElement('a');a.href=scene3d.screenshot();a.download='line2-entrance-3d.png';a.click();};
