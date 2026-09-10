import * as THREE from 'three';

// Finish set based on:
// - LX Z:IN Diamant 회벽/블랑 그레이 PR002-13
// - Dongwha Natus Jin Grande Emotion Blanc
// - Younglim PX454-2 Luca White
// Colors/textures are a calibrated digital approximation for design review,
// not a substitute for physical samples under site lighting.

const FINISH_INFO = Object.freeze({
  wall: {
    brand: 'LX Z:IN',
    product: '디아망 회벽/블랑 그레이',
    code: 'PR002-13',
    note: '펄 없는 차분한 회벽 계열 · 미세 요철 · 저광택'
  },
  floor: {
    brand: '동화자연마루',
    product: '나투스진 그란데 이모션블랑',
    code: 'Emotion Blanc',
    sizeMm: [325, 810, 7],
    note: '화이트톤의 간결한 석재 디자인 · 타일 느낌의 광폭 마루'
  },
  film: {
    brand: '영림',
    product: '루카 화이트',
    code: 'PX454-2',
    note: '화이트 스톤/마블 계열 필름 · 은은한 패턴'
  }
});

function seeded(seed=1){
  let s=seed>>>0;
  return ()=>((s=(1664525*s+1013904223)>>>0)/4294967296);
}

function canvasTexture(size, draw){
  const c=document.createElement('canvas'); c.width=c.height=size;
  const ctx=c.getContext('2d'); draw(ctx,size);
  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.anisotropy=4;
  return t;
}

function grayTexture(size, draw){
  const c=document.createElement('canvas'); c.width=c.height=size;
  const ctx=c.getContext('2d'); draw(ctx,size);
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.anisotropy=4;
  return t;
}

function wallpaperMap(){
  // Slightly warm neutral grey derived from the supplied installed-room reference,
  // lifted to account for photographic exposure and warm indoor lighting.
  return canvasTexture(512,(ctx,n)=>{
    const rnd=seeded(210213);
    ctx.fillStyle='#deddd7'; ctx.fillRect(0,0,n,n);
    // very low-contrast plaster mottling
    for(let i=0;i<1800;i++){
      const a=.012+rnd()*.028, v=195+Math.round(rnd()*42);
      ctx.fillStyle=`rgba(${v},${v},${Math.max(180,v-4)},${a})`;
      const r=.8+rnd()*4.5; ctx.beginPath(); ctx.arc(rnd()*n,rnd()*n,r,0,Math.PI*2); ctx.fill();
    }
    // soft irregular trowel streaks, no sparkle/pearl
    ctx.lineWidth=1;
    for(let i=0;i<95;i++){
      const y=rnd()*n; ctx.strokeStyle=`rgba(120,120,116,${.015+rnd()*.018})`;
      ctx.beginPath(); ctx.moveTo(rnd()*n*.2,y); ctx.bezierCurveTo(n*.3,y+rnd()*10-5,n*.7,y+rnd()*10-5,n,y+rnd()*7-3.5); ctx.stroke();
    }
  });
}

function wallpaperBump(){
  return grayTexture(256,(ctx,n)=>{
    const rnd=seeded(9917); ctx.fillStyle='#808080';ctx.fillRect(0,0,n,n);
    for(let i=0;i<2200;i++){
      const v=110+Math.round(rnd()*70); ctx.fillStyle=`rgb(${v},${v},${v})`;
      const r=.5+rnd()*2.1;ctx.beginPath();ctx.arc(rnd()*n,rnd()*n,r,0,Math.PI*2);ctx.fill();
    }
  });
}

function floorMap(){
  return canvasTexture(1024,(ctx,n)=>{
    const rnd=seeded(325810);
    ctx.fillStyle='#d8d5cc';ctx.fillRect(0,0,n,n);
    // calm mineral variation; intentionally low contrast
    for(let i=0;i<320;i++){
      const x=rnd()*n,y=rnd()*n,rx=20+rnd()*120,ry=7+rnd()*42;
      const g=ctx.createRadialGradient(x,y,0,x,y,rx);
      const warm=rnd()>.5 ? '152,148,138' : '236,234,226';
      g.addColorStop(0,`rgba(${warm},${.025+rnd()*.04})`);g.addColorStop(1,`rgba(${warm},0)`);
      ctx.fillStyle=g;ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);ctx.beginPath();ctx.arc(0,0,rx,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    // board joints represented as fine, warm-grey lines.
    ctx.strokeStyle='rgba(112,108,102,.28)';ctx.lineWidth=2;
    ctx.strokeRect(1,1,n-2,n-2);
  });
}

function floorBump(){
  return grayTexture(512,(ctx,n)=>{
    const rnd=seeded(881);ctx.fillStyle='#808080';ctx.fillRect(0,0,n,n);
    for(let i=0;i<850;i++){
      const v=120+Math.round(rnd()*30);ctx.strokeStyle=`rgba(${v},${v},${v},.12)`;ctx.lineWidth=.5+rnd()*1.5;
      ctx.beginPath();ctx.moveTo(rnd()*n,rnd()*n);ctx.quadraticCurveTo(rnd()*n,rnd()*n,rnd()*n,rnd()*n);ctx.stroke();
    }
  });
}

function filmMap(){
  return canvasTexture(768,(ctx,n)=>{
    const rnd=seeded(4542);ctx.fillStyle='#ecebe6';ctx.fillRect(0,0,n,n);
    // very restrained Luca White stone/marble pattern
    for(let i=0;i<22;i++){
      let x=-n*.1+rnd()*n*.35, y=rnd()*n;
      ctx.strokeStyle=`rgba(152,151,146,${.035+rnd()*.035})`;ctx.lineWidth=.7+rnd()*1.7;
      ctx.beginPath();ctx.moveTo(x,y);
      for(let k=1;k<=5;k++){x+=n*.22+rnd()*n*.08;y+=rnd()*90-45;ctx.lineTo(x,y)}
      ctx.stroke();
    }
  });
}

export function createFinishLibrary(renderer){
  const wallTex=wallpaperMap(), wallBump=wallpaperBump();
  const floorTex=floorMap(), floorBumpTex=floorBump();
  const filmTex=filmMap();
  const maxAniso=renderer?.capabilities?.getMaxAnisotropy?.()||4;
  [wallTex,wallBump,floorTex,floorBumpTex,filmTex].forEach(t=>t.anisotropy=Math.min(8,maxAniso));

  const wall=new THREE.MeshStandardMaterial({
    color:'#f0efeb', map:wallTex, bumpMap:wallBump, bumpScale:.006,
    roughness:.96, metalness:0
  });
  const film=new THREE.MeshStandardMaterial({
    color:'#ffffff', map:filmTex, roughness:.58, metalness:0
  });
  const glass=new THREE.MeshPhysicalMaterial({
    color:'#d6edf4',transparent:true,opacity:.26,roughness:.08,metalness:0,
    transmission:.18,depthWrite:false
  });
  const bathroom=new THREE.MeshStandardMaterial({color:'#d8d8d4',roughness:.72,metalness:0});
  const entry=new THREE.MeshStandardMaterial({color:'#d0d0cb',roughness:.76,metalness:0});
  const balcony=new THREE.MeshStandardMaterial({color:'#d9d7d0',roughness:.8,metalness:0});
  const ceiling=new THREE.MeshStandardMaterial({color:'#f8f7f3',roughness:.98,metalness:0,side:THREE.DoubleSide});

  function floorMaterial(roomId, bounds){
    if(roomId==='bath1'||roomId==='bath2') return bathroom;
    if(roomId==='entry') return entry;
    if(roomId?.startsWith('bal')) return balcony;
    const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.78,metalness:0});
    m.map=floorTex.clone();m.map.needsUpdate=true;m.map.colorSpace=THREE.SRGBColorSpace;m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;
    m.bumpMap=floorBumpTex.clone();m.bumpMap.needsUpdate=true;m.bumpMap.wrapS=m.bumpMap.wrapT=THREE.RepeatWrapping;m.bumpScale=.003;
    // Physical board size 810 x 325 mm. Shape UVs are local-normalized; repeat to approximate actual scale.
    const width=Math.max(.5,bounds.width), depth=Math.max(.5,bounds.depth);
    m.map.repeat.set(width/.81,depth/.325);m.bumpMap.repeat.copy(m.map.repeat);
    return m;
  }

  return {info:FINISH_INFO,wall,film,glass,ceiling,floorMaterial};
}

export {FINISH_INFO};
