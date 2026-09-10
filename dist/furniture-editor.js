const NS='http://www.w3.org/2000/svg';
const STORAGE_KEY='yeoksam-furniture-layout-v1';
const clone=o=>JSON.parse(JSON.stringify(o));
function mergeSaved(baseItems,saved){
 const byId=new Map((Array.isArray(saved)?saved:[]).filter(x=>x&&x.id).map(x=>[x.id,x]));
 return baseItems.map(base=>{const s=byId.get(base.id);if(!s)return clone(base);return {...clone(base),position:Array.isArray(s.position)?clone(s.position):clone(base.position),rotationY:Number.isFinite(Number(s.rotationY))?Number(s.rotationY):(base.rotationY||0)};});
}
export function createFurnitureEditor({host,baseItems,onChange,onSelect}){
 let items=clone(baseItems), selected=null;
 const saved=localStorage.getItem(STORAGE_KEY);
 if(saved){try{items=mergeSaved(baseItems,JSON.parse(saved));}catch{}}
 const colors={fridge:'#aeb9c0',washtower:'#b7b7b3',bed:'#d9cbb7',sofa:'#9e968b',tv:'#34383b'};
 function selectedItem(){return items.find(x=>x.id===selected)||null;}
 function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(items));onChange?.(clone(items));}
 function draw(){
  const svg=host.querySelector('svg'); if(!svg)return;
  svg.querySelector('#furniture-editor-layer')?.remove();
  const g=document.createElementNS(NS,'g');g.id='furniture-editor-layer';g.style.pointerEvents='all';svg.append(g);
  for(const it of items){
   const [w,,d]=it.size, rot=((it.rotationY||0)%180+180)%180, rw=rot===90?d:w, rd=rot===90?w:d;
   const r=document.createElementNS(NS,'rect');r.setAttribute('x',it.position[0]-rw/2);r.setAttribute('y',it.position[2]-rd/2);r.setAttribute('width',rw);r.setAttribute('height',rd);r.setAttribute('rx','55');r.setAttribute('fill',colors[it.category]||'#bbb');r.setAttribute('fill-opacity','.82');r.setAttribute('stroke',selected===it.id?'#d64545':'#263b47');r.setAttribute('stroke-width',selected===it.id?'45':'22');r.dataset.id=it.id;r.style.cursor='pointer';r.style.touchAction='manipulation';g.append(r);
   const t=document.createElementNS(NS,'text');t.setAttribute('x',it.position[0]);t.setAttribute('y',it.position[2]);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');t.setAttribute('font-size','170');t.setAttribute('font-family','sans-serif');t.setAttribute('pointer-events','none');t.textContent=it.name.replace(/삼성 |LG 트롬 |시몬스 |자코모 /g,'');g.append(t);
   r.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();selected=it.id;draw();updateInfo();onSelect?.(clone(it));});
  }
 }
 function updateInfo(){
  const el=document.querySelector('#furnitureInfo'),it=selectedItem();
  if(el)el.textContent=it?`${it.name} · ${it.size[0]}×${it.size[2]} mm · 위치 X ${Math.round(it.position[0])} / Y ${Math.round(it.position[2])} · 회전 ${it.rotationY||0}°`:'가구를 눌러 선택한 뒤 화살표로 이동하세요.';
  document.querySelectorAll('[data-furniture-action]').forEach(b=>b.disabled=!it);
 }
 function move(dx,dz){const it=selectedItem();if(!it)return;it.position[0]=Math.round(it.position[0]+dx);it.position[2]=Math.round(it.position[2]+dz);save();draw();updateInfo();}
 function rotate(dir=1){const it=selectedItem();if(!it)return;it.rotationY=((it.rotationY||0)+(dir>=0?90:-90)+360)%360;save();draw();updateInfo();}
 function reset(){items=clone(baseItems);selected=null;localStorage.removeItem(STORAGE_KEY);onChange?.(clone(items));draw();updateInfo();onSelect?.(null);}
 function exportData(){return {version:1,schemaVersion:1,units:'mm',coordinateSystem:{position:'x,y,z',rotationDeg:'degrees around Y axis',internalRotationField:'rotationY (degrees)'},furniture:items.map(it=>({id:it.id,type:it.category||it.type||'furniture',name:it.name||'',size:{width:it.size?.[0]??null,height:it.size?.[1]??null,depth:it.size?.[2]??null},position:{x:it.position?.[0]??0,y:it.position?.[1]??0,z:it.position?.[2]??0},rotationDeg:it.rotationY||0,rotationY:it.rotationY||0,source:{size:clone(it.size),position:clone(it.position)}}))};}
 function showExport(){const text=JSON.stringify(exportData(),null,2),box=document.querySelector('#furnitureExportDialog'),ta=document.querySelector('#furnitureExportJson');if(ta)ta.value=text;if(box){box.hidden=false;document.body.classList.add('dialog-open');}return text;}
 async function copyExport(){const text=JSON.stringify(exportData(),null,2);try{await navigator.clipboard.writeText(text);return true;}catch{const ta=document.querySelector('#furnitureExportJson');if(ta){ta.value=text;ta.focus();ta.select();return document.execCommand('copy');}return false;}}
 function closeExport(){document.querySelector('#furnitureExportDialog')?.setAttribute('hidden','');document.body.classList.remove('dialog-open');}
 return {draw,move,rotate,reset,showExport,copyExport,closeExport,exportData,items:()=>clone(items),selected:()=>selectedItem()?clone(selectedItem()):null,updateInfo};
}
