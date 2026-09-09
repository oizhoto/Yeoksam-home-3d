import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
const $=s=>document.querySelector(s);
const [base,interior]=await Promise.all(['BASE_GEOMETRY_V1.json','INTERIOR_V1.json'].map(async p=>validate(await(await fetch(p,{cache:'no-store'})).json())));
const materials=await(await fetch('materials.json',{cache:'no-store'})).json();
let materialPreset=materials.presets.find(p=>p.id===materials.defaultPreset)||materials.presets[0],stage='original',view='plan';
const viewer=createShared3D($('#scene')), source=()=>stage==='original'?base:interior;
const names={original:'원본',expansion:'확장',materials:'도배·바닥',furniture:'가구',final:'완성안'};
function drawPlan(){$('#plan').innerHTML=planSvg(source(),{showImage:false,orientationLabel:(stage==='original'?'BASE_GEOMETRY_V1':'INTERIOR_V1')+' · 2호 라인'});}
function model(){viewer.update(source(),stage==='materials'||stage==='final'?{materialPreset}:{});}
function setView(v){view=v;document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#plan').hidden=v!=='plan';$('#scene').hidden=v==='plan';model();if(v==='overview')viewer.whole();if(v==='entry')viewer.entrance();const n=v==='plan'?'2D 평면':v==='overview'?'3D 보기':'현관 시점';$('#viewTitle').textContent=names[stage]+' · '+n;$('#viewSubtitle').textContent=stage==='original'?'BASE_GEOMETRY_V1':'INTERIOR_V1';$('#active').textContent=names[stage]+' · '+n;}
function setStage(s){stage=s;document.querySelectorAll('.stage').forEach(b=>b.classList.toggle('active',b.dataset.stage===s));$('#materialPanel').hidden=s!=='materials';drawPlan();model();setView(view);$('#note').textContent=s==='original'?'BASE_GEOMETRY_V1 원본 · 2호 라인 좌우반전 geometry 기준':'현재 설계 레이어를 동일한 2D/3D 좌표계에서 표시합니다.';}
document.querySelectorAll('.stage').forEach(b=>b.onclick=()=>setStage(b.dataset.stage));document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));
const sel=$('#materialPreset');for(const p of materials.presets){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;sel.append(o)}sel.value=materialPreset.id;
function md(){$('#materialDetail').textContent=`벽: ${materialPreset.wall.label} · 바닥: ${materialPreset.floor.label}`}md();sel.onchange=()=>{materialPreset=materials.presets.find(p=>p.id===sel.value)||materials.presets[0];model();md()};
$('#saveView').onclick=()=>{if(view==='plan'){const svg=$('#plan svg');if(!svg)return;const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'})),a=document.createElement('a');a.href=u;a.download=`${names[stage]}-2D.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}else{const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${names[stage]}-${view}.png`;a.click()}};
$('#evidence').textContent='2D · 3D · 현관 시점은 같은 geometry 데이터를 사용합니다. 이번 수정은 UI만 정리하며 BASE geometry는 변경하지 않습니다.';
for(const id of interior.expansion?.retainedStructure||[]){const w=interior.walls.find(x=>x.id===id);if(w){const li=document.createElement('li');li.textContent=w.name+' — STRUCTURE_UNCONFIRMED';$('#structures').append(li)}}
setStage('original');setView('plan');
