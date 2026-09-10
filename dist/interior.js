import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
import {createFurnitureEditor} from './furniture-editor.js';
import {drawEntryLayer} from './entry-layer.js';
import {drawKitchenLayer} from './kitchen-layer.js';

const $=s=>document.querySelector(s);
const load=async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error(`${p}를 읽지 못했습니다.`);return r.json();};

const [expandedRaw,furnitureData,fixedData,designData,bathKitchenData]=await Promise.all([
  load('INTERIOR_V2_SVG_EXPANSION.json'),
  load('FURNITURE_V1.json'),
  load('FIXED_INTERIOR_V1.json'),load('DESIGN_V1.json'),load('BATHROOM_KITCHEN_V1.json')
]);

const expanded=validate(expandedRaw);
let view='plan';
let furnitureOn=false;
let designOn=false;
let wallHalf=false;
const viewer=createShared3D($('#scene'));
let editor;

const activeFurniture=()=>furnitureOn?(editor?editor.items():furnitureData.items):[];

function label(){return furnitureOn?'확장안 + 가구':'확장안';}

function drawPlan(){
  $('#plan').innerHTML=planSvg(expanded,{showImage:false,orientationLabel:'INTERIOR_V2_SVG_EXPANSION · 2호 라인'});
  drawEntryLayer($('#plan'),{objects:fixedData.entryObjects},{enabled:true});
  drawKitchenLayer($('#plan'),{objects:fixedData.kitchenObjects},{enabled:true});
  if(furnitureOn)editor?.draw();
}

function model(){
  viewer.update(expanded);
  viewer.setEntry(fixedData.entryObjects);
  viewer.setKitchen(fixedData.kitchenObjects);
  viewer.setBathroomKitchen(bathKitchenData);
  viewer.setFurniture(activeFurniture());
  viewer.setDesign(designData,designOn);
}

function refreshUI(){
  $('#furnitureToggle').classList.toggle('active',furnitureOn);
  ['resetFurniture','exportFurniture'].forEach(id=>$('#'+id).hidden=!furnitureOn);
  $('#furnitureControls').hidden=!(furnitureOn&&view==='plan');
  const vn=view==='plan'?'2D':view==='overview'?'3D':'워크스루';
  $('#viewTitle').textContent=`${label()} · ${vn}`;
  $('#viewSubtitle').textContent='INTERIOR_V2_SVG_EXPANSION';
  $('#active').textContent=`${label()} · ${vn}`;
  $('#note').textContent='V8.24 · 확정 마감재 질감 개선 검토안 · 기존 V8.23 구조와 인테리어 배치 유지.';
}

function render(){drawPlan();model();refreshUI();}

function setView(v){
  const changed=view!==v;
  view=v;
  document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $('#plan').hidden=v!=='plan';
  $('#scene').hidden=v==='plan';
  render();
  if(changed){
    if(view==='overview')viewer.whole();
    if(view==='entry')viewer.entrance();
  }
}

$('#furnitureToggle').onclick=()=>{furnitureOn=!furnitureOn;render();};
$('#designToggle').onclick=()=>{designOn=!designOn;$('#designToggle').classList.toggle('active',designOn);
$('#wallHeightToggle').onclick=()=>{wallHalf=!wallHalf;viewer.setWallHeightMode(wallHalf?'half':'full');refreshUI();};
  $('#wallHeightToggle').classList.toggle('active',wallHalf);
  $('#wallHeightToggle').setAttribute('aria-pressed',String(wallHalf));
  $('#wallHeightToggle').textContent=wallHalf?'벽 원래 높이':'벽 1/2 보기';$('#designControls').hidden=!designOn;if(designOn)setView('overview');else render();};
document.querySelectorAll('[data-design-camera]').forEach(b=>b.onclick=()=>{setView('entry');viewer.designCamera(designData.cameras[b.dataset.designCamera]);});
$('#designLight').onchange=e=>viewer.setLightMode(e.target.value==='warm');
document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));

$('#saveView').onclick=()=>{
  if(view==='plan'){
    const svg=$('#plan svg');if(!svg)return;
    const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
    const a=document.createElement('a');a.href=u;a.download=`${label()}-2D.svg`;a.click();
    setTimeout(()=>URL.revokeObjectURL(u),1000);
  }else{
    const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${label()}-${view}.png`;a.click();
  }
};

editor=createFurnitureEditor({
  host:$('#plan'),
  baseItems:furnitureData.items,
  onChange:items=>{if(furnitureOn)viewer.setFurniture(items);}
});

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

for(const id of ['shaft-bottom','shaft-top','shaft-right']){
  const w=expanded.walls.find(x=>x.id===id);
  if(w){const li=document.createElement('li');li.textContent=`${w.name||id} — 내력벽/구조체 유지`;$('#structures').append(li);}
}
setView('plan');
