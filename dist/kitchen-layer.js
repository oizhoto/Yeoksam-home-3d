const NS='http://www.w3.org/2000/svg';
export function drawKitchenLayer(host,data,{enabled=true}={}){
 const svg=host.querySelector('svg'); if(!svg)return;
 svg.querySelector('#kitchen-layer')?.remove(); if(!enabled)return;
 const g=document.createElementNS(NS,'g');g.id='kitchen-layer';g.style.pointerEvents='none';svg.append(g);
 const lower=(data.objects||[]).find(o=>o.type==='lowerCabinetRun');
 const upper=(data.objects||[]).find(o=>o.type==='upperCabinetRun');
 if(lower){
  const [w,,d]=lower.size,[x,,z]=lower.position;
  const r=document.createElementNS(NS,'rect');r.setAttribute('x',x-w/2);r.setAttribute('y',z-d/2);r.setAttribute('width',w);r.setAttribute('height',d);r.setAttribute('fill','#ddd9d0');r.setAttribute('stroke','#6f7777');r.setAttribute('stroke-width','22');g.append(r);
  let cursor=z-d/2;for(const m of lower.modules||[]){cursor+=m;const l=document.createElementNS(NS,'line');l.setAttribute('x1',x-w/2);l.setAttribute('x2',x+w/2);l.setAttribute('y1',cursor);l.setAttribute('y2',cursor);l.setAttribute('stroke','#8b8f8c');l.setAttribute('stroke-width','14');g.append(l);}
  const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',z);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');t.setAttribute('font-size','135');t.setAttribute('font-family','sans-serif');t.setAttribute('fill','#263b47');t.setAttribute('transform',`rotate(-90 ${x} ${z})`);t.textContent='일자 주방장';g.append(t);
 }
 if(upper){
  const [w,,d]=upper.size,[x,,z]=upper.position;
  const r=document.createElementNS(NS,'rect');r.setAttribute('x',x-w/2);r.setAttribute('y',z-d/2);r.setAttribute('width',w);r.setAttribute('height',d);r.setAttribute('fill','none');r.setAttribute('stroke','#9a8f80');r.setAttribute('stroke-width','16');r.setAttribute('stroke-dasharray','55 35');g.append(r);
 }
}
