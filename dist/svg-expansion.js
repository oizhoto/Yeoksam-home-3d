import {planSvg,validate} from './plan-core.js';
import {createShared3D} from './shared-3d.js';
const $=s=>document.querySelector(s);
try{
 const [expanded,v2]=await Promise.all(['INTERIOR_V2_SVG_EXPANSION.json','INTERIOR_V2.json'].map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw Error('모델 읽기 실패');return validate(await r.json());}));
 const view=createShared3D($('#scene'));let started=false;
 function show(c){const camera=started?view.cameraState():null;view.update(c);if(camera)view.setCamera(camera);else view.whole();started=true;$('#plan').innerHTML=planSvg(c,{showImage:false,orientationLabel:c.geometryRevision});$('#state').textContent=c===expanded?'SVG 확장안':'V2 비교';$('#expanded').classList.toggle('primary',c===expanded);$('#v2').classList.toggle('primary',c===v2);}
 $('#expanded').onclick=()=>show(expanded);$('#v2').onclick=()=>show(v2);$('#whole').onclick=()=>view.whole();$('#entrance').onclick=()=>view.entrance();show(expanded);
}catch(e){$('#state').textContent='화면을 불러오지 못했습니다: '+e.message;}
