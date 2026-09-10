import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
import {createFurnitureEditor} from './furniture-editor.js';
import {drawEntryLayer} from './entry-layer.js';
import {drawKitchenLayer} from './kitchen-layer.js';
const $=s=>document.querySelector(s);const load=async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error(`${p}를 읽지 못했습니다.`);return r.json();};
const [baseRaw,expandedRaw,furnitureData,entryData,kitchenData]=await Promise.all([load('BASE_GEOMETRY_V1.json'),load('INTERIOR_V2_SVG_EXPANSION.json'),load('FURNITURE_V1.json'),load('ENTRY_INTERIOR_V1.json'),load('KITCHEN_V1.json')]);
const base=validate(baseRaw),expanded=validate(expandedRaw);let original=false,view='plan';const layers={entry:false,kitchen:false,furniture:false};const viewer=createShared3D($('#scene'));let editor;
const source=()=>original?base:expanded;const activeFurniture=()=>!original&&layers.furniture?(editor?editor.items():furnitureData.items):[];const activeEntry=()=>!original&&layers.entry?entryData.objects:[];const activeKitchen=()=>!original&&layers.kitchen?kitchenData.objects:[];
function label(){if(original)return '원본';const on=[];if(layers.entry)on.push('중문');if(layers.kitchen)on.push('주방');if(layers.furniture)on.push('가구');return on.length?`확장안 + ${on.join(' + ')}`:'확장안';}
function drawPlan(){const src=source();$('#plan').innerHTML=planSvg(src,{showImage:false,orientationLabel:original?'BASE_GEOMETRY_V1 · 2호 라인':'INTERIOR_V2_SVG_EXPANSION · 2호 라인'});if(!original&&layers.entry)drawEntryLayer($('#plan'),entryData,{enabled:true});if(!original&&layers.kitchen)drawKitchenLayer($('#plan'),kitchenData,{enabled:true});if(!original&&layers.furniture)editor?.draw();}
function model(){viewer.update(source());viewer.setEntry(activeEntry());viewer.setKitchen(activeKitchen());viewer.setFurniture(activeFurniture());}
function refreshUI(){document.querySelectorAll('.layer-toggle').forEach(b=>b.classList.toggle('active',layers[b.dataset.layer]&&!original));$('#originalToggle').classList.toggle('active',original);$('#finalPreset').classList.toggle('active',!original&&layers.entry&&layers.kitchen&&layers.furniture);const edit=!original&&layers.furniture;['resetFurniture','exportFurniture'].forEach(id=>$('#'+id).hidden=!edit);$('#furnitureControls').hidden=!(edit&&view==='plan');const vn=view==='plan'?'2D':view==='overview'?'3D':'워크스루';$('#viewTitle').textContent=`${label()} · ${vn}`;$('#viewSubtitle').textContent=original?'BASE_GEOMETRY_V1':'INTERIOR_V2_SVG_EXPANSION';$('#active').textContent=`${label()} · ${vn}`;$('#note').textContent=original?'비교용 원본입니다. 설계 레이어는 잠시 숨깁니다.':`확정된 확장 geometry${layers.entry?' + 중문/현관':''}${layers.kitchen?' + 주방장 V1':''}${layers.furniture?' + 가구/가전':''}을 표시합니다.`;}
function render(){drawPlan();model();refreshUI();}
function setView(v){const changed=view!==v;view=v;document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#plan').hidden=v!=='plan';$('#scene').hidden=v==='plan';render();if(changed){if(view==='overview')viewer.whole();if(view==='entry')viewer.entrance();}}
document.querySelectorAll('.layer-toggle').forEach(b=>b.onclick=()=>{original=false;layers[b.dataset.layer]=!layers[b.dataset.layer];render();});
$('#finalPreset').onclick=()=>{original=false;layers.entry=true;layers.kitchen=true;layers.furniture=true;render();};
$('#originalToggle').onclick=()=>{original=!original;render();};
document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#saveView').onclick=()=>{if(view==='plan'){const svg=$('#plan svg');if(!svg)return;const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=u;a.download=`${label()}-2D.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}else{const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${label()}-${view}.png`;a.click();}};
editor=createFurnitureEditor({host:$('#plan'),baseItems:furnitureData.items,onChange:items=>{if(!original&&layers.furniture)viewer.setFurniture(items);}});
const furnitureStep=()=>Number($('#furnitureStep').value)||50;
$('#moveUp').onclick=()=>editor.move(0,-furnitureStep());
$('#moveDown').onclick=()=>editor.move(0,furnitureStep());
$('#moveLeft').onclick=()=>editor.move(-furnitureStep(),0);
$('#moveRight').onclick=()=>editor.move(furnitureStep(),0);
$('#rotateLeft').onclick=()=>editor.rotate(-1);
$('#rotateRight').onclick=()=>editor.rotate(1);
$('#resetFurniture').textContent='가구 배치 초기화';
$('#resetFurniture').onclick=()=>{if(confirm('저장된 가구 배치를 삭제하고 코드의 기본 배치로 돌아갈까요?'))editor.reset();};
$('#exportFurniture').onclick=()=>editor.showExport();
$('#closeFurnitureExport').onclick=()=>editor.closeExport();
$('#furnitureExportDialog').addEventListener('click',e=>{if(e.target===$('#furnitureExportDialog'))editor.closeExport();});
$('#copyFurnitureExport').onclick=async()=>{const ok=await editor.copyExport();$('#copyFurnitureStatus').textContent=ok?'복사했습니다.':'복사하지 못했습니다. JSON을 길게 눌러 복사하세요.';};
editor.updateInfo();
$('#evidence').textContent='주방 V1은 확정 geometry를 건드리지 않는 별도 레이어입니다. 1차안은 일자형 상·하부장과 상판만 반영했습니다. H900/D600 하부, D350 상부, 상부장 하단 H1500, 상단 H2280(천장 2300에서 20mm 이격)을 기본값으로 사용하며 실측 후 조정합니다.';
for(const id of ['shaft-bottom','shaft-top','shaft-right']){const w=expanded.walls.find(x=>x.id===id);if(w){const li=document.createElement('li');li.textContent=`${w.name||id} — 내력벽/구조체 유지`;$('#structures').append(li);}}
setView('plan');
