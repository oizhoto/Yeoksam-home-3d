const NS='http://www.w3.org/2000/svg';
export function drawEntryLayer(host,data,{enabled=true}={}){
 const svg=host.querySelector('svg'); if(!svg)return;
 svg.querySelector('#entry-layer')?.remove(); if(!enabled)return;
 const g=document.createElementNS(NS,'g');g.id='entry-layer';g.style.pointerEvents='none';svg.append(g);
 for(const o of data.objects||[]){
  const [w,,dep]=o.size,[x,,z]=o.position;
  if(o.type==='screenDoor'){
   const line=document.createElementNS(NS,'line');line.setAttribute('x1',x);line.setAttribute('x2',x);line.setAttribute('y1',z-dep/2);line.setAttribute('y2',z+dep/2);line.setAttribute('stroke','#4b8790');line.setAttribute('stroke-width','55');line.setAttribute('stroke-opacity','.9');g.append(line);
  }else{
   const r=document.createElementNS(NS,'rect');r.setAttribute('x',x-w/2);r.setAttribute('y',z-dep/2);r.setAttribute('width',w);r.setAttribute('height',dep);r.setAttribute('rx','30');r.setAttribute('fill',o.type==='mirror'?'#bfe0e5':'#eeeae2');r.setAttribute('fill-opacity',o.type==='mirror'?'.65':'.9');r.setAttribute('stroke','#687d86');r.setAttribute('stroke-width','22');g.append(r);
  }
  const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',z);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');t.setAttribute('font-size','130');t.setAttribute('font-family','sans-serif');t.setAttribute('fill','#243746');t.textContent=o.type==='screenDoor'?'중문':o.type==='cabinet'?'현관장':'거울';g.append(t);
 }
}
