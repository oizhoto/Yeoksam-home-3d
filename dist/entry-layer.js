const NS='http://www.w3.org/2000/svg';
export function drawEntryLayer(host,data,{enabled=true}={}){
 const svg=host.querySelector('svg'); if(!svg)return;
 svg.querySelector('#entry-layer')?.remove(); if(!enabled)return;
 const g=document.createElementNS(NS,'g');g.id='entry-layer';g.style.pointerEvents='none';svg.append(g);
 for(const o of data.objects||[]){
  const [w,,dep]=o.size,[x,,z]=o.position,rot=((o.rotationY||0)%180+180)%180;
  if(o.type==='screenDoor'||o.type==='turningDoor'){
   const line=document.createElementNS(NS,'line');
   if(rot===90){line.setAttribute('x1',x-dep/2);line.setAttribute('x2',x+dep/2);line.setAttribute('y1',z);line.setAttribute('y2',z);}else{line.setAttribute('x1',x);line.setAttribute('x2',x);line.setAttribute('y1',z-dep/2);line.setAttribute('y2',z+dep/2);}
   line.setAttribute('stroke',o.type==='turningDoor'?'#627f87':'#4b8790');line.setAttribute('stroke-width','55');line.setAttribute('stroke-opacity','.9');g.append(line);
  }else{
   const rw=rot===90?dep:w,rd=rot===90?w:dep;
   const r=document.createElementNS(NS,'rect');r.setAttribute('x',x-rw/2);r.setAttribute('y',z-rd/2);r.setAttribute('width',rw);r.setAttribute('height',rd);r.setAttribute('rx','30');
   r.setAttribute('fill',o.type==='mirror'?'#dbe8ea':o.type==='partitionWall'?'#f3f0e9':o.type==='wardrobe'?'#f1efe9':'#eeeae2');r.setAttribute('fill-opacity',o.type==='mirror'?'.72':'1');r.setAttribute('stroke','#687d86');r.setAttribute('stroke-width','22');g.append(r);
   if(o.type==='wardrobe'){
    const panels=Math.max(2,Math.round(dep/600));
    for(let i=1;i<panels;i++){const zz=z-dep/2+dep*i/panels;const l=document.createElementNS(NS,'line');l.setAttribute('x1',x-w/2);l.setAttribute('x2',x+w/2);l.setAttribute('y1',zz);l.setAttribute('y2',zz);l.setAttribute('stroke','#aaa59d');l.setAttribute('stroke-width','10');g.append(l);}
   }
  }
  const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',z);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');t.setAttribute('font-size','130');t.setAttribute('font-family','sans-serif');t.setAttribute('fill','#243746');
  t.textContent=o.type==='screenDoor'?'중문':o.type==='turningDoor'?'터닝도어':o.type==='cabinet'?'현관장':o.type==='wardrobe'?'붙박이장':o.type==='partitionWall'?'가벽':'거울';g.append(t);
 }
}
