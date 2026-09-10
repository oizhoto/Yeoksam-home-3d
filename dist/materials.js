import * as THREE from 'three';

// Finish set based on:
// - LX Z:IN Diamant 회벽/블랑 그레이 PR002-13
// - Dongwha Natus Jin Grande Emotion Blanc
// - Younglim PX454-2 Luca White
// Colors/textures are an uncalibrated digital approximation for design review,
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


// Seamless, seeded mineral fields. Coordinates are in meters, not screen pixels.
// This is a restrained procedural approximation, not measured manufacturer PBR.
function periodicNoise(seed, nx, ny){
  const random=seeded(seed), values=Array.from({length:nx*ny},()=>random()*2-1);
  return (u,v)=>{
    const x=u*nx,y=v*ny,ix=Math.floor(x),iy=Math.floor(y);
    const sx=x-ix,sy=y-iy,tx=sx*sx*(3-2*sx),ty=sy*sy*(3-2*sy);
    const at=(a,b)=>values[((b%ny+ny)%ny)*nx+(a%nx+nx)%nx];
    const a=at(ix,iy)*(1-tx)+at(ix+1,iy)*tx;
    const b=at(ix,iy+1)*(1-tx)+at(ix+1,iy+1)*tx;
    return a*(1-ty)+b*ty;
  };
}

function finishMaps(kind){
  const floor=kind==='floor',film=kind==='film';
  const n=floor?1024:512,base=floor?[216,213,204]:film?[236,235,230]:[222,221,215];
  const seed=floor?325810:film?4542:210213;
  const broad=periodicNoise(seed,floor?12:8,floor?5:8);
  const medium=periodicNoise(seed+1,floor?60:48,floor?24:48);
  const grain=periodicNoise(seed+2,192,192);
  const channels=['color','height','roughness'].map(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=n;
    const ctx=canvas.getContext('2d');return {canvas,ctx,pixels:ctx.createImageData(n,n)};
  });
  const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const u=(x+.5)/n,v=(y+.5)/n,b=broad(u,v),m=medium(u,v),g=grain(u,v);
    // Four aligned 810x325mm boards in a 1620x650mm atlas. Preserve laying direction.
    const bx=(u*2)%1,by=(v*2)%1;
    const edge=floor?Math.min(Math.min(bx,1-bx)*.81,Math.min(by,1-by)*.325):1;
    // A 1.1mm core with soft edge shading remains sampled along the long atlas axis.
    const joint=floor?1-smooth(.00055,.0011,edge):0;
    const bevel=floor?1-smooth(.0006,.0016,edge):0;
    const board=floor?[-1.1,.7,.2,-.4][Math.floor(v*2)*2+Math.floor(u*2)]:0;
    const tone=floor?7*b+2.8*m+.7*g+board-26*joint-4*bevel:
      film?2.4*b+1.2*m+.5*g:6*b+2.8*m+.8*g;
    const height=floor?155+9*m+4*g-95*bevel:film?128+9*m+7*g:128+27*m+22*g+9*b;
    const rough=floor?226+13*b+10*bevel:film?232+8*m:242+10*m;
    const i=(y*n+x)*4;
    for(let c=0;c<3;c++){
      channels[0].pixels.data[i+c]=base[c]+tone;
      channels[1].pixels.data[i+c]=height;
      channels[2].pixels.data[i+c]=rough;
    }
    for(const channel of channels)channel.pixels.data[i+3]=255;
  }
  const textures=channels.map(({canvas,ctx,pixels},i)=>{
    ctx.putImageData(pixels,0,0);const t=new THREE.CanvasTexture(canvas);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=i===0?THREE.SRGBColorSpace:THREE.NoColorSpace;
    t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
    return t;
  });
  return {color:textures[0],height:textures[1],roughness:textures[2]};
}


export const MATERIAL_V1=Object.freeze({
  appVersion:'V8.24',
  revision:'MATERIAL_VISUAL_REFINEMENT',
  wall:{id:'LX_DIAMANT_PR002_13',tileMeters:.25,roughness:.96,bumpMeters:.00065},
  floor:{id:'DONGWHA_NATUSJIN_GRANDE_EMOTION_BLANC',boardMeters:[.81,.325],atlasBoards:[2,2],roughness:.73,bumpMeters:.00065},
  film:{id:'YOUNGLIM_LUCA_WHITE_PX454_2',tileMeters:.4,roughness:.55,bumpMeters:.00010},
  note:'Procedural visual approximation. Color, relief and gloss are not measured manufacturer PBR data.'
});


// BoxGeometry UVs are normalized; only UV/material state is altered, never vertices.
export function materialForBox(source,width,height,depth,tileMeters){
  return [[depth,height],[depth,height],[width,depth],[width,depth],[width,height],[width,height]].map(([u,v])=>{
    const m=source.clone();m.userData={...source.userData,owned:true};
    for(const key of ['map','bumpMap','roughnessMap'])if(source[key]){m[key]=source[key].clone();m[key].repeat.set(u/tileMeters,v/tileMeters);m[key].needsUpdate=true;}
    return m;
  });
}

export function createFinishLibrary(renderer){
  const wallMaps=finishMaps('wall'),floorMaps=finishMaps('floor'),filmMaps=finishMaps('film');
  const wallTex=wallMaps.color,wallBump=wallMaps.height;
  const floorTex=floorMaps.color,floorBumpTex=floorMaps.height,filmTex=filmMaps.color;
  const maxAniso=renderer?.capabilities?.getMaxAnisotropy?.()||4;
  [wallMaps,floorMaps,filmMaps].flatMap(m=>Object.values(m)).forEach(t=>t.anisotropy=Math.min(8,maxAniso));

  const wall=new THREE.MeshStandardMaterial({
    color:'#ffffff', map:wallTex, bumpMap:wallBump, bumpScale:MATERIAL_V1.wall.bumpMeters,
    roughness:MATERIAL_V1.wall.roughness, roughnessMap:wallMaps.roughness, metalness:0
  });
  const film=new THREE.MeshStandardMaterial({
    color:'#ffffff', map:filmTex,bumpMap:filmMaps.height,bumpScale:MATERIAL_V1.film.bumpMeters,
    roughness:MATERIAL_V1.film.roughness,roughnessMap:filmMaps.roughness,metalness:0
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
    const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:MATERIAL_V1.floor.roughness,roughnessMap:floorMaps.roughness.clone(),metalness:0});
    m.map=floorTex.clone();m.map.needsUpdate=true;m.map.colorSpace=THREE.SRGBColorSpace;m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;
    m.bumpMap=floorBumpTex.clone();m.bumpMap.needsUpdate=true;m.bumpMap.wrapS=m.bumpMap.wrapT=THREE.RepeatWrapping;m.bumpScale=MATERIAL_V1.floor.bumpMeters;
    // ExtrudeGeometry top UVs already contain the shape's meter coordinates.
    // Multiplying by room dimensions again shrinks boards and breaks room continuity.
    m.map.repeat.set(1/(MATERIAL_V1.floor.boardMeters[0]*MATERIAL_V1.floor.atlasBoards[0]),1/(MATERIAL_V1.floor.boardMeters[1]*MATERIAL_V1.floor.atlasBoards[1]));m.bumpMap.repeat.copy(m.map.repeat);m.roughnessMap.repeat.copy(m.map.repeat);
    m.userData.materialId=MATERIAL_V1.floor.id;
    return m;
  }

  wall.userData.materialId=MATERIAL_V1.wall.id;film.userData.materialId=MATERIAL_V1.film.id;
  return {info:FINISH_INFO,wall,film,glass,ceiling,floorMaterial};
}

export {FINISH_INFO};
