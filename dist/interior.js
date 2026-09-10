import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
import {createFurnitureEditor} from './furniture-editor.js';
import {drawEntryLayer} from './entry-layer.js';
const $=s=>document.querySelector(s);const load=async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error(`${p}를 읽지 못했습니다.`);return r.json();};
const [baseRaw,expandedRaw,furnitureData,entryData]=await Promise.all([load('BASE_GEOMETRY_V1.json'),load('INTERIOR_V2_SVG_EXPANSION.json'),load('FURNITURE_V1.json'),load('ENTRY_INTERIOR_V1.json')]);
const base=validate(baseRaw),expanded=validate(expandedRaw);let original=false,view='plan';const layers={entry:false,furniture:false};const viewer=createShared3D($('#scene'));let editor;
const source=()=>original?base:expanded;const activeFurniture=()=>!original&&layers.furniture?(editor?editor.items():furnitureData.items):[];const activeEntry=()=>!original&&layers.entry?entryData.objects:[];
function label(){if(original)return '원본';const on=[];if(layers.entry)on.push('중문');if(layers.furniture)on.push('가구');return on.length?`확장안 + ${on.join(' + ')}`:'확장안';}
function drawPlan(){const src=source();$('#plan').innerHTML=planSvg(src,{showImage:false,orientationLabel:original?'BASE_GEOMETRY_V1 · 2호 라인':'INTERIOR_V2_SVG_EXPANSION · 2호 라인'});if(!original&&layers.entry)drawEntryLayer($('#plan'),entryData,{enabled:true});if(!original&&layers.furniture)editor?.draw();}
function model(){viewer.update(source());viewer.setEntry(activeEntry());viewer.setFurniture(activeFurniture());}
function refreshUI(){document.querySelectorAll('.layer-toggle').forEach(b=>b.classList.toggle('active',layers[b.dataset.layer]&&!original));$('#originalToggle').classList.toggle('active',original);$('#finalPreset').classList.toggle('active',!original&&layers.entry&&layers.furniture);const edit=!original&&layers.furniture;['rotateFurniture','resetFurniture','exportFurniture'].forEach(id=>$('#'+id).hidden=!edit);$('#furnitureInfo').hidden=!edit;const vn=view==='plan'?'2D':view==='overview'?'3D':'워크스루';$('#viewTitle').textContent=`${label()} · ${vn}`;$('#viewSubtitle').textContent=original?'BASE_GEOMETRY_V1':'INTERIOR_V2_SVG_EXPANSION';$('#active').textContent=`${label()} · ${vn}`;$('#note').textContent=original?'비교용 원본입니다. 설계 레이어는 잠시 숨깁니다.':layers.entry&&layers.furniture?'확장 geometry + 중문/현관 + 가구 레이어를 함께 표시합니다.':layers.entry?'확장 geometry 위에 중문·현관 수납 레이어를 표시합니다.':layers.furniture?'확장 geometry 위에 가구·가전 레이어를 표시합니다.':'확정된 확장 geometry만 표시합니다.';}
function render(){drawPlan();model();refreshUI();if(view==='overview')viewer.whole();if(view==='entry')viewer.entrance();}
function setView(v){view=v;document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#plan').hidden=v!=='plan';$('#scene').hidden=v==='plan';render();}
document.querySelectorAll('.layer-toggle').forEach(b=>b.onclick=()=>{original=false;layers[b.dataset.layer]=!layers[b.dataset.layer];render();});
$('#finalPreset').onclick=()=>{original=false;layers.entry=true;layers.furniture=true;render();};
$('#originalToggle').onclick=()=>{original=!original;render();};
document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#saveView').onclick=()=>{if(view==='plan'){const svg=$('#plan svg');if(!svg)return;const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=u;a.download=`${label()}-2D.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}else{const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${label()}-${view}.png`;a.click();}};
editor=createFurnitureEditor({host:$('#plan'),baseItems:furnitureData.items,onChange:items=>{if(!original&&layers.furniture)viewer.setFurniture(items);}});$('#rotateFurniture').onclick=()=>editor.rotate();$('#resetFurniture').onclick=()=>editor.reset();$('#exportFurniture').onclick=()=>editor.download();
$('#evidence').textContent='중문 V1은 사용자가 제공한 레퍼런스의 구성(반투명 슬림 프레임 중문, 천장형 수납장, 오픈 니치, 전신거울)을 현재 현관 공간에 맞춘 1차안입니다. 정확한 제작 치수는 현장 실측 전까지 설계값입니다.';
for(const id of ['shaft-bottom','shaft-top','shaft-right']){const w=expanded.walls.find(x=>x.id===id);if(w){const li=document.createElement('li');li.textContent=`${w.name||id} — 내력벽/구조체 유지`;$('#structures').append(li);}}
setView('plan');
