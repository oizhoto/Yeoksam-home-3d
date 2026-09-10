import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
import {createFurnitureEditor} from './furniture-editor.js';
const $=s=>document.querySelector(s);
const load=async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error(`${p}를 읽지 못했습니다.`);return r.json();};
const [baseRaw,expandedRaw,furnitureData]=await Promise.all([load('BASE_GEOMETRY_V1.json'),load('INTERIOR_V2_SVG_EXPANSION.json'),load('FURNITURE_V1.json')]);
const base=validate(baseRaw),expanded=validate(expandedRaw);
let stage='original',view='plan';
const viewer=createShared3D($('#scene'));
const source=()=>stage==='original'?base:expanded;
const names={original:'원본',expansion:'확장',entrydoor:'중문',furniture:'가구',final:'완성안'};
let editor;
const furnitureForStage=()=>stage==='furniture'||stage==='final'?(editor?editor.items():furnitureData.items):[];
function drawPlan(){const src=source();$('#plan').innerHTML=planSvg(src,{showImage:false,orientationLabel:stage==='original'?'BASE_GEOMETRY_V1 · 2호 라인':'INTERIOR_V2_SVG_EXPANSION · 2호 라인'});if(stage==='furniture'||stage==='final')editor?.draw();}
function model(){viewer.update(source());viewer.setFurniture(furnitureForStage());}
function setView(v){view=v;document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#plan').hidden=v!=='plan';$('#scene').hidden=v==='plan';model();if(v==='overview')viewer.whole();if(v==='entry')viewer.entrance();const vn=v==='plan'?'2D':v==='overview'?'3D':'워크스루';$('#viewTitle').textContent=`${names[stage]} · ${vn}`;$('#viewSubtitle').textContent=stage==='original'?'BASE_GEOMETRY_V1':stage==='furniture'?'FURNITURE_V1':'INTERIOR_V2_SVG_EXPANSION';$('#active').textContent=`${names[stage]} · ${vn}`;}
function setStage(s){stage=s;document.querySelectorAll('.stage').forEach(b=>b.classList.toggle('active',b.dataset.stage===s));drawPlan();model();setView(view);const editing=stage==='furniture';['rotateFurniture','resetFurniture','exportFurniture'].forEach(id=>$('#'+id).hidden=!editing);$('#furnitureInfo').hidden=!editing;if(editing)editor?.updateInfo();$('#note').textContent=stage==='original'?'BASE_GEOMETRY_V1 원본 · 변경 없음':stage==='entrydoor'?'확장 geometry 위에 중문·현관 수납 설계를 올리는 단계입니다. BASE/확장 geometry는 변경하지 않습니다.':stage==='furniture'?'확정 확장 geometry 위에 실물 크기 기준 가구·가전 V1을 표시합니다. 위치는 초안이며 geometry는 변경하지 않습니다.':'확장 기준 geometry를 사용합니다. 철거된 발코니 경계벽은 3D에서도 생성하지 않습니다.';}
document.querySelectorAll('.stage').forEach(b=>b.onclick=()=>setStage(b.dataset.stage));document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#saveView').onclick=()=>{if(view==='plan'){const svg=$('#plan svg');if(!svg)return;const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=u;a.download=`${names[stage]}-2D.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}else{const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${names[stage]}-${view}.png`;a.click();}};
editor=createFurnitureEditor({host:$('#plan'),baseItems:furnitureData.items,onChange:items=>{if(stage==='furniture'||stage==='final')viewer.setFurniture(items);}});
$('#rotateFurniture').onclick=()=>editor.rotate();$('#resetFurniture').onclick=()=>editor.reset();$('#exportFurniture').onclick=()=>editor.download();
$('#evidence').textContent='가구 V1: 삼성 키친핏 4도어, LG 워시타워, 시몬스 LK 매트리스, 자코모 3.5인 소파 계획 envelope, 삼성 75형 TV. 가구 단계에서만 표시되며 BASE/확장 geometry JSON은 수정하지 않습니다.';
for(const id of ['shaft-bottom','shaft-top','shaft-right']){const w=expanded.walls.find(x=>x.id===id);if(w){const li=document.createElement('li');li.textContent=`${w.name||id} — 내력벽/구조체 유지`;$('#structures').append(li);}}
setStage('original');setView('plan');
