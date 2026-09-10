import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
const $=s=>document.querySelector(s);

const load=async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error(`${p}를 읽지 못했습니다.`);return validate(await r.json());};
const [base,expanded]=await Promise.all([
  load('BASE_GEOMETRY_V1.json'),
  load('INTERIOR_V2_SVG_EXPANSION.json')
]);

let stage='original',view='plan';
const viewer=createShared3D($('#scene'));
const source=()=>stage==='original'?base:expanded;
const names={original:'원본',expansion:'확장',furniture:'가구',final:'완성안'};

function drawPlan(){
  const src=source();
  $('#plan').innerHTML=planSvg(src,{showImage:false,orientationLabel:stage==='original'?'BASE_GEOMETRY_V1 · 2호 라인':'INTERIOR_V2_SVG_EXPANSION · 2호 라인'});
}
function model(){viewer.update(source());}
function setView(v){
  view=v;
  document.querySelectorAll('.view').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $('#plan').hidden=v!=='plan';
  $('#scene').hidden=v==='plan';
  model();
  if(v==='overview')viewer.whole();
  if(v==='entry')viewer.entrance();
  const vn=v==='plan'?'2D 평면':v==='overview'?'3D 보기':'현관 시점';
  $('#viewTitle').textContent=`${names[stage]} · ${vn}`;
  $('#viewSubtitle').textContent=stage==='original'?'BASE_GEOMETRY_V1':'INTERIOR_V2_SVG_EXPANSION';
  $('#active').textContent=`${names[stage]} · ${vn}`;
}
function setStage(s){
  stage=s;
  document.querySelectorAll('.stage').forEach(b=>b.classList.toggle('active',b.dataset.stage===s));
  drawPlan();
  model();
  setView(view);
  $('#note').textContent=stage==='original'
    ? 'BASE_GEOMETRY_V1 원본 · 변경 없음'
    : '확장 기준 geometry를 사용합니다. 철거된 발코니 경계벽은 3D에서도 생성하지 않습니다.';
}

document.querySelectorAll('.stage').forEach(b=>b.onclick=()=>setStage(b.dataset.stage));
document.querySelectorAll('.view').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#saveView').onclick=()=>{
  if(view==='plan'){
    const svg=$('#plan svg');if(!svg)return;
    const u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
    const a=document.createElement('a');a.href=u;a.download=`${names[stage]}-2D.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
  }else{
    const a=document.createElement('a');a.href=viewer.screenshot();a.download=`${names[stage]}-${view}.png`;a.click();
  }
};

$('#evidence').textContent='원본은 BASE_GEOMETRY_V1, 확장/가구/완성안은 INTERIOR_V2_SVG_EXPANSION을 사용합니다. 확장 시 삭제된 내부 발코니 경계는 walls 목록에 없으므로 3D mesh와 collision 모두 생성되지 않습니다.';
for(const id of ['shaft-bottom','shaft-top','shaft-right']){
  const w=expanded.walls.find(x=>x.id===id);
  if(w){const li=document.createElement('li');li.textContent=`${w.name||id} — 내력벽/구조체 유지`;$('#structures').append(li);}
}
setStage('original');
setView('plan');
