const NS='http://www.w3.org/2000/svg';
const clone=o=>JSON.parse(JSON.stringify(o));
export function createFurnitureEditor({host,baseItems,onChange}){
 let items=clone(baseItems), selected=null, drag=null;
 const saved=localStorage.getItem('yeoksam-furniture-layout-v1');
 if(saved){try{const s=JSON.parse(saved); if(Array.isArray(s)) items=s;}catch{}}
 const colors={fridge:'#aeb9c0',washtower:'#b7b7b3',bed:'#d9cbb7',sofa:'#9e968b',tv:'#34383b'};
 function save(){localStorage.setItem('yeoksam-furniture-layout-v1',JSON.stringify(items));onChange?.(clone(items));}
 function draw(){
  const svg=host.querySelector('svg'); if(!svg)return;
  svg.querySelector('#furniture-editor-layer')?.remove();
  const g=document.createElementNS(NS,'g');g.id='furniture-editor-layer';g.style.pointerEvents='all';svg.append(g);
  for(const it of items){
   const [w,,d]=it.size, rot=((it.rotationY||0)%180+180)%180, rw=rot===90?d:w, rd=rot===90?w:d;
   const r=document.createElementNS(NS,'rect');r.setAttribute('x',it.position[0]-rw/2);r.setAttribute('y',it.position[2]-rd/2);r.setAttribute('width',rw);r.setAttribute('height',rd);r.setAttribute('rx','55');r.setAttribute('fill',colors[it.category]||'#bbb');r.setAttribute('fill-opacity','.82');r.setAttribute('stroke',selected===it.id?'#d64545':'#263b47');r.setAttribute('stroke-width',selected===it.id?'45':'22');r.dataset.id=it.id;r.style.cursor='grab';g.append(r);
   const t=document.createElementNS(NS,'text');t.setAttribute('x',it.position[0]);t.setAttribute('y',it.position[2]);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');t.setAttribute('font-size','170');t.setAttribute('font-family','sans-serif');t.setAttribute('pointer-events','none');t.textContent=it.name.replace(/삼성 |LG 트롬 |시몬스 |자코모 /g,'');g.append(t);
   r.addEventListener('pointerdown',e=>{e.preventDefault();selected=it.id;const p=point(svg,e);drag={id:it.id,dx:it.position[0]-p.x,dz:it.position[2]-p.y};r.setPointerCapture?.(e.pointerId);draw();updateInfo();});
  }
  svg.onpointermove=e=>{if(!drag)return;const p=point(svg,e),it=items.find(x=>x.id===drag.id);it.position[0]=Math.round((p.x+drag.dx)/10)*10;it.position[2]=Math.round((p.y+drag.dz)/10)*10;draw();updateInfo();onChange?.(clone(items));};
  svg.onpointerup=()=>{if(drag){drag=null;save();}};
 }
 function point(svg,e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
 function updateInfo(){const el=document.querySelector('#furnitureInfo'),it=items.find(x=>x.id===selected);if(el)el.textContent=it?`${it.name} · ${it.size[0]}×${it.size[2]} mm · 회전 ${it.rotationY||0}°`:'가구를 눌러 선택하고 드래그하세요.';}
 function rotate(){const it=items.find(x=>x.id===selected);if(!it)return;it.rotationY=((it.rotationY||0)+90)%360;save();draw();updateInfo();}
 function reset(){items=clone(baseItems);localStorage.removeItem('yeoksam-furniture-layout-v1');save();draw();updateInfo();}
 function download(){const blob=new Blob([JSON.stringify({schemaVersion:1,units:'mm',name:'Yeoksam Furniture Layout',items},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='FURNITURE_LAYOUT.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 return {draw,rotate,reset,download,items:()=>clone(items),updateInfo};
}
