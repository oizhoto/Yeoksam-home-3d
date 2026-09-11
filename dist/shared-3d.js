import * as THREE from 'three';
import {CanvasRenderer} from './canvas-renderer.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {compileGeometry,entranceFrame,blocked} from './plan-core.js';
import {createFinishLibrary,materialForBox,MATERIAL_V1} from './materials.js';
import {createDesignLayer} from './design-layer.js';
import {buildBathroomKitchenLayer} from './bathroom-kitchen-layer.js';
export const APP_VERSION='V8.26';
export function createShared3D(host,{onCameraChange}={}){
host.dataset.appVersion=APP_VERSION;
if(!host.querySelector('[data-yeoksam-version-badge]')){
 const badge=document.createElement('div');
 badge.dataset.yeoksamVersionBadge='true';
 badge.textContent=APP_VERSION;
 Object.assign(badge.style,{
  position:'absolute',right:'10px',top:'10px',zIndex:'20',
  padding:'4px 8px',borderRadius:'7px',
  background:'rgba(20,24,28,.68)',color:'#fff',
  font:'600 12px/1.2 system-ui,-apple-system,sans-serif',
  letterSpacing:'.02em',pointerEvents:'none',
  backdropFilter:'blur(4px)'
 });
 const pos=getComputedStyle(host).position;
 if(pos==='static')host.style.position='relative';
 host.append(badge);
}
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7edf0');let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});host.dataset.renderer='WebGL';}catch{renderer=new CanvasRenderer();host.dataset.renderer='Canvas3D';}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;if('toneMapping' in renderer){renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;}host.append(renderer.domElement);
const finishes=createFinishLibrary(renderer);
// Neutral daylight-biased lighting so material comparison is not excessively yellow.
scene.add(new THREE.HemisphereLight('#fffdfa','#a9adb0',1.65));const sun=new THREE.DirectionalLight('#fff7e8',2.6);sun.position.set(-4,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});sun.shadow.bias=-.00035;scene.add(sun);scene.add(sun.target);sun.target.position.set(4,0,5);const fill=new THREE.DirectionalLight('#edf4ff',.55);fill.position.set(8,7,-5);scene.add(fill);
const camera=new THREE.PerspectiveCamera(90,1,.03,100);camera.rotation.order='YXZ';const orbit=new OrbitControls(camera,renderer.domElement);orbit.enabled=false;orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI/2-.05;let config,compiled,signature='',mode='entry',yaw=0,pitch=0,dirtyCamera=true;const body=new THREE.Group(),labels=new THREE.Group(),ceiling=new THREE.Group(),furniture=new THREE.Group(),entryLayer=new THREE.Group(),kitchenLayer=new THREE.Group(),bathKitchenLayer=new THREE.Group();scene.add(body,labels,ceiling,furniture,entryLayer,kitchenLayer,bathKitchenLayer);let furnitureItems=[],entryItems=[],kitchenItems=[];const mm=v=>v/1000,keys={};
function clear(g){g.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m?.userData?.owned){for(const key of ['map','bumpMap','roughnessMap'])m[key]?.dispose();m.dispose();}});g.clear();}
function segment(p){const dx=p.b[0]-p.a[0],dz=p.b[1]-p.a[1],len=Math.hypot(dx,dz),glass=p.kind==='glass',door=p.kind==='door';const material=glass?finishes.glass:materialForBox(door?finishes.film:finishes.wall,mm(len),mm(p.height),mm(p.thickness),door?MATERIAL_V1.film.tileMeters:MATERIAL_V1.wall.tileMeters);const m=new THREE.Mesh(new THREE.BoxGeometry(mm(len),mm(p.height),mm(p.thickness)),material);m.position.set(mm((p.a[0]+p.b[0])/2),mm(p.y+p.height/2),mm((p.a[1]+p.b[1])/2));m.rotation.y=-Math.atan2(dz,dx);m.userData.geometryId=p.id;m.userData.wallSegment=true;m.userData.wallBaseBottom=mm(p.y);m.userData.wallBaseHeight=mm(p.height);m.castShadow=!glass;m.receiveShadow=true;if(!(config.unknownStructureDisplay==='wireframe'&&p.structureStatus==='STRUCTURE_UNCONFIRMED'))body.add(m);if(p.structureStatus==='STRUCTURE_UNCONFIRMED'){const edge=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:'#c17c16'}));edge.position.copy(m.position);edge.rotation.copy(m.rotation);body.add(edge);}}
function floor(f){const shape=new THREE.Shape();let minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;f.polygon.forEach(([x,z],i)=>{minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);i?shape.lineTo(mm(x),-mm(z)):shape.moveTo(mm(x),-mm(z));});shape.closePath();const fm=finishes.floorMaterial(f.roomId,{width:mm(maxX-minX),depth:mm(maxZ-minZ)});if(![finishes.glass,finishes.wall,finishes.film,finishes.ceiling].includes(fm))fm.userData.owned=true;const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:mm(config.settings.floorThickness),bevelEnabled:false}),fm);mesh.rotation.x=-Math.PI/2;mesh.position.y=-mm(config.settings.floorThickness);mesh.receiveShadow=true;mesh.userData.geometryId=f.id;body.add(mesh);const top=new THREE.Mesh(new THREE.ShapeGeometry(shape),finishes.ceiling);top.rotation.x=-Math.PI/2;top.position.y=mm(config.settings.ceilingHeight);ceiling.add(top);}
function label(r){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffffdf';ctx.fillRect(12,18,488,90);ctx.font='600 45px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle=r.id==='living'?'#0d7480':'#28434f';ctx.fillText(r.name,256,80);const texture=new THREE.CanvasTexture(canvas),s=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));s.position.set(mm(r.labelPosition[0]),mm(config.settings.labelHeight),mm(r.labelPosition[1]));s.scale.set(1.45,.3625,1);s.renderOrder=20;s.userData.roomId=r.id;labels.add(s);}
function furnitureMaterial(category){
 const colors={fridge:'#d8dde0',washtower:'#c8c9c7',bed:'#eee9df',sofa:'#a9a39a',tv:'#151718'};
 return new THREE.MeshStandardMaterial({color:colors[category]||'#c9c3b8',roughness:category==='tv'?.28:.72,metalness:category==='fridge'||category==='washtower'?.18:0});
}
function renderFurniture(){
 clear(furniture);
 for(const item of furnitureItems){
  const [w,h,d]=item.size; const mat=furnitureMaterial(item.category);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);
  mesh.position.set(mm(item.position[0]),mm((item.position[1]||0)+h/2),mm(item.position[2]));
  mesh.rotation.y=THREE.MathUtils.degToRad(item.rotationY||0); mesh.castShadow=true;mesh.receiveShadow=true;
  mesh.userData.furnitureId=item.id;mesh.userData.name=item.name; furniture.add(mesh);
  if(item.category==='tv'){
   const screen=new THREE.Mesh(new THREE.PlaneGeometry(mm(w)*.96,mm(h)*.92),new THREE.MeshStandardMaterial({color:'#050607',roughness:.18}));
   screen.position.set(0,0,mm(d)/2+.002); mesh.add(screen);
  }
 }
}
function setFurniture(items=[]){furnitureItems=items;renderFurniture();}

function renderEntry(){
 clear(entryLayer);
 for(const o of entryItems){
  const [w,h,d]=o.size,[x,y,z]=o.position;
  if(o.type==='screenDoor'||o.type==='turningDoor'){
   const frameMat=new THREE.MeshStandardMaterial({color:'#e8ecec',roughness:.55,metalness:.18});
   const glassMat=new THREE.MeshPhysicalMaterial({color:'#dfecee',transparent:true,opacity:.42,roughness:.78,metalness:0,side:THREE.DoubleSide});
   const group=new THREE.Group();
   const glass=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),glassMat);glass.position.y=mm(h/2);group.add(glass);
   const bar=34;
   for(const zz of [-d/2+bar/2,d/2-bar/2]){const m=new THREE.Mesh(new THREE.BoxGeometry(mm(w+18),mm(h),mm(bar)),frameMat);m.position.set(0,mm(h/2),mm(zz));group.add(m);}
   for(const yy of [bar/2,h-bar/2]){const m=new THREE.Mesh(new THREE.BoxGeometry(mm(w+18),mm(bar),mm(d)),frameMat);m.position.set(0,mm(yy),0);group.add(m);}
   group.position.set(mm(x),mm(y),mm(z));group.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);entryLayer.add(group);
  }else if(o.type==='cabinet'){
   const mat=new THREE.MeshStandardMaterial({color:'#e9e7e1',roughness:.82});
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);mesh.position.set(mm(x),mm(y+h/2),mm(z));mesh.castShadow=true;mesh.receiveShadow=true;entryLayer.add(mesh);
   if(o.niche){const nm=new THREE.MeshStandardMaterial({color:'#c9c2b6',roughness:.88});const niche=new THREE.Mesh(new THREE.BoxGeometry(mm(w*.82),mm(o.niche.height),mm(d+8)),nm);niche.position.set(mm(x),mm(o.niche.y+o.niche.height/2),mm(z+d*.02));entryLayer.add(niche);}
  }else if(o.type==='wardrobe'){
   const mat=new THREE.MeshStandardMaterial({color:'#efede7',roughness:.8});
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);mesh.position.set(mm(x),mm(y+h/2),mm(z));mesh.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);mesh.castShadow=true;mesh.receiveShadow=true;entryLayer.add(mesh);
   const panels=Math.max(2,Math.round(d/600));
   for(let i=1;i<panels;i++){const seam=new THREE.Mesh(new THREE.BoxGeometry(mm(w+4),mm(h*.96),.008),new THREE.MeshStandardMaterial({color:'#aaa59d',roughness:.9}));seam.position.set(0,0,mm(-d/2+d*i/panels));mesh.add(seam);}
  }else if(o.type==='partitionWall'){
   const mat=finishes.wall.clone();mat.userData.owned=true;
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);mesh.position.set(mm(x),mm(y+h/2),mm(z));mesh.castShadow=true;mesh.receiveShadow=true;entryLayer.add(mesh);
  }else if(o.type==='mirror'){
   const mat=new THREE.MeshPhysicalMaterial({color:'#d9e4e6',roughness:.08,metalness:.35,clearcoat:.65,clearcoatRoughness:.08});
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);mesh.position.set(mm(x),mm(y+h/2),mm(z));entryLayer.add(mesh);
  }
 }
}
function setEntry(items=[]){entryItems=items;renderEntry();}


function kitchenMaterial(type){
 if(type==='countertop')return new THREE.MeshStandardMaterial({color:'#d8d5ce',roughness:.58,metalness:.02});
 return new THREE.MeshStandardMaterial({color:'#eeeae2',roughness:.76,metalness:0});
}
function renderKitchen(){
 clear(kitchenLayer);

 const basicMat=()=>new THREE.MeshStandardMaterial({color:'#eeeae2',roughness:.76,metalness:0});
 const darkMat=()=>new THREE.MeshStandardMaterial({color:'#1f2528',roughness:.32,metalness:.18});
 const steelMat=()=>new THREE.MeshStandardMaterial({color:'#bfc5c7',roughness:.34,metalness:.62});

 function addDishwasherFace(parent,w,h,d,zCenter){
   // LG DIOS built-in visual language: clean light front, dark upper control strip, small display.
   const front=new THREE.Mesh(new THREE.BoxGeometry(mm(w+8),mm(h-24),mm(d-6)),basicMat());
   front.position.set(mm(-8),mm(h/2),mm(zCenter)); parent.add(front);
   const strip=new THREE.Mesh(new THREE.BoxGeometry(mm(14),mm(55),mm(d-18)),darkMat());
   strip.position.set(mm(-w/2-14),mm(h-65),mm(zCenter)); parent.add(strip);
   const display=new THREE.Mesh(new THREE.BoxGeometry(mm(18),mm(24),mm(90)),darkMat());
   display.position.set(mm(-w/2-23),mm(h-66),mm(zCenter+90)); parent.add(display);
   const handle=new THREE.Mesh(new THREE.BoxGeometry(mm(20),mm(18),mm(d-90)),steelMat());
   handle.position.set(mm(-w/2-20),mm(h-120),mm(zCenter)); parent.add(handle);
 }

 for(const o of kitchenItems){
  const [w,h,d]=o.size,[x,y,z]=o.position;

  if(o.type==='lowerCabinetRun' && Array.isArray(o.modules)){
    const g=new THREE.Group();
    let cursor=-d/2;
    const kinds=o.moduleKinds||o.modules.map(()=> 'cabinet');
    o.modules.forEach((mw,i)=>{
      const kind=kinds[i]||'cabinet';
      const zc=cursor+mw/2;
      if(kind==='dishwasher'){
        addDishwasherFace(g,w,h,mw,zc);
      }else{
        const face=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(mw-5)),basicMat());
        face.position.set(0,mm(h/2),mm(zc));g.add(face);
        if(kind==='knife'){
          // thin vertical knife/spice pull-out: narrow front + top finger gap
          const seam=new THREE.Mesh(new THREE.BoxGeometry(mm(8),mm(h-35),mm(4)),darkMat());
          seam.position.set(mm(-w/2-3),mm(h/2),mm(zc));g.add(seam);
          const grip=new THREE.Mesh(new THREE.BoxGeometry(mm(14),mm(55),mm(mw-28)),darkMat());
          grip.position.set(mm(-w/2-8),mm(h-75),mm(zc));g.add(grip);
        }else{
          const topGap=new THREE.Mesh(new THREE.BoxGeometry(mm(8),mm(4),mm(mw-18)),darkMat());
          topGap.position.set(mm(-w/2-4),mm(h-60),mm(zc));g.add(topGap);
        }
      }
      cursor+=mw;
    });
    g.position.set(mm(x),mm(y),mm(z));g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);
    kitchenLayer.add(g);
    continue;
  }

  if(o.type==='upperCabinetRun' && Array.isArray(o.modules)){
    const g=new THREE.Group();let cursor=-d/2;
    o.modules.forEach(mw=>{
      const face=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(mw-5)),basicMat());
      face.position.set(0,mm(h/2),mm(cursor+mw/2));g.add(face);cursor+=mw;
    });
    g.position.set(mm(x),mm(y),mm(z));g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);
    kitchenLayer.add(g);continue;
  }

  if(o.type==='countertop' && o.sinkCutout){
    const c=o.sinkCutout;
    const localSinkZ=c.centerZ-z;
    const z0=-d/2, z1=d/2, cut0=localSinkZ-c.sizeZ/2, cut1=localSinkZ+c.sizeZ/2;
    const side=(w-c.sizeX)/2;

    const addSlab=(sw,sd,sx,sz)=>{
      if(sw<=0||sd<=0)return;
      const m=new THREE.Mesh(new THREE.BoxGeometry(mm(sw),mm(h),mm(sd)),kitchenMaterial('countertop'));
      m.position.set(mm(sx),mm(h/2),mm(sz));m.castShadow=true;m.receiveShadow=true;kitchenLayer.add(m);
      m.position.x+=mm(x);m.position.y+=mm(y);m.position.z+=mm(z);
    };
    // before / after the cutout
    addSlab(w,cut0-z0,0,(z0+cut0)/2);
    addSlab(w,z1-cut1,0,(cut1+z1)/2);
    // front/back strips beside the actual opening
    addSlab(side,c.sizeZ,-w/2+side/2,localSinkZ);
    addSlab(side,c.sizeZ,w/2-side/2,localSinkZ);
    continue;
  }

  const mat=kitchenMaterial(o.type);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);
  mesh.position.set(mm(x),mm(y+h/2),mm(z));mesh.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);
  mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.kitchenId=o.id;kitchenLayer.add(mesh);
 }
}
function setKitchen(items=[]){kitchenItems=items;renderKitchen();}
function setBathroomKitchen(data){
 clear(bathKitchenLayer);
 if(!data)return;
 const built=buildBathroomKitchenLayer(data);
 while(built.children.length)bathKitchenLayer.add(built.children[0]);
 bathKitchenLayer.visible=true;
 dirtyCamera=true;
}

let wallHeightMode='full';
function setWallHeightMode(mode='full'){
 wallHeightMode=mode==='half'?'half':'full';
 body.traverse(o=>{
   if(!o.userData?.wallSegment)return;
   const baseH=o.userData.wallBaseHeight;
   const bottom=o.userData.wallBaseBottom;
   if(wallHeightMode==='half'){
     o.scale.y=.5;
     o.position.y=bottom+baseH*.25;
   }else{
     o.scale.y=1;
     o.position.y=bottom+baseH*.5;
   }
 });
 host.dataset.wallHeightMode=wallHeightMode;
 dirtyCamera=true;
}
// V8.26 walkthrough: Twinmotion-style first-person review with mobile dual-touch controls.
const WALK_EYE_MM=1600;
const WALK_FOV=78;
const coarse=matchMedia?.('(pointer: coarse)')?.matches ?? false;
let walkSpeedMode='walk';
let joyForward=0,joyRight=0;
let lookPointer=null,lookLastX=0,lookLastY=0;
let mouseLookPointer=null,mouseLastX=0,mouseLastY=0;
let walkthroughUI=null;

function walkSpeedFactor(){return walkSpeedMode==='inspect'?.35:1;}
function enforceEyeHeight(){if(mode==='walk')camera.position.y=mm(WALK_EYE_MM);}
function safePoint(x,z){
 if(!config||!compiled)return [x,z];
 if(!blocked(config,compiled,[x,z]))return [x,z];
 for(let radius=120;radius<=1200;radius+=120){
  for(let a=0;a<Math.PI*2;a+=Math.PI/8){
   const px=x+Math.cos(a)*radius,pz=z+Math.sin(a)*radius;
   if(!blocked(config,compiled,[px,pz]))return [px,pz];
  }
 }
 return [x,z];
}
function roomPoint(id){
 const r=config?.rooms?.find(x=>x.id===id);
 return r?.labelPosition||null;
}
function teleportWalk(where){
 if(!config)return;
 let p=null;
 if(where==='entry'){
  const f=entranceFrame(config);
  p=f.center;
 }else if(where==='living')p=roomPoint('living');
 else if(where==='kitchen')p=roomPoint('kitchen');
 else if(where==='master')p=roomPoint('bed1');
 if(!p)return;
 const [x,z]=safePoint(p[0],p[1]);
 camera.position.set(mm(x),mm(WALK_EYE_MM),mm(z));
 mode='walk';orbit.enabled=false;ceiling.visible=true;setWallHeightMode('full');
 camera.fov=WALK_FOV;camera.updateProjectionMatrix();dirtyCamera=true;syncWalkUI();
}
function enterFullscreen(){
 const el=host;
 if(document.fullscreenElement)document.exitFullscreen?.();
 else el.requestFullscreen?.().catch?.(()=>{});
}
function syncWalkUI(){
 if(!walkthroughUI)return;
 const walking=mode==='walk';
 walkthroughUI.root.hidden=!walking;
 walkthroughUI.speed.textContent=walkSpeedMode==='walk'?'Walk':'Inspect';
 host.dataset.walkthroughMode=walking?'walk':'off';
}
function createWalkthroughUI(){
 if(walkthroughUI)return walkthroughUI;
 const root=document.createElement('div');
 root.dataset.walkthroughUi='true';
 Object.assign(root.style,{position:'absolute',inset:'0',zIndex:'18',pointerEvents:'none',userSelect:'none',WebkitUserSelect:'none'});
 const help=document.createElement('div');
 help.textContent=coarse?'왼쪽 스틱 이동 · 오른쪽 화면 드래그 시선':'WASD 이동 · 드래그/클릭 후 마우스로 시선';
 Object.assign(help.style,{position:'absolute',left:'50%',top:'12px',transform:'translateX(-50%)',padding:'7px 11px',borderRadius:'999px',background:'rgba(18,22,25,.62)',color:'#fff',font:'600 12px/1.2 system-ui,sans-serif',backdropFilter:'blur(5px)',whiteSpace:'nowrap',pointerEvents:'none'});
 root.append(help);
 setTimeout(()=>{help.style.opacity='.18';help.style.transition='opacity .5s';},4200);

 const quick=document.createElement('div');
 Object.assign(quick.style,{position:'absolute',left:'50%',bottom:'14px',transform:'translateX(-50%)',display:'flex',gap:'6px',pointerEvents:'auto'});
 for(const [id,label] of [['entry','현관'],['living','거실'],['kitchen','주방'],['master','안방']]){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  Object.assign(b.style,{border:'0',borderRadius:'999px',padding:'7px 10px',background:'rgba(25,29,31,.62)',color:'#fff',font:'600 12px system-ui,sans-serif',backdropFilter:'blur(5px)'});
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();teleportWalk(id);});
  quick.append(b);
 }
 root.append(quick);

 const tools=document.createElement('div');
 Object.assign(tools.style,{position:'absolute',right:'10px',top:'42px',display:'grid',gap:'6px',pointerEvents:'auto'});
 const speed=document.createElement('button');speed.type='button';speed.textContent='Walk';
 const full=document.createElement('button');full.type='button';full.textContent='⛶';
 for(const b of [speed,full])Object.assign(b.style,{border:'0',borderRadius:'9px',padding:'8px 10px',minWidth:'44px',background:'rgba(25,29,31,.62)',color:'#fff',font:'700 12px system-ui,sans-serif',backdropFilter:'blur(5px)'});
 speed.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();walkSpeedMode=walkSpeedMode==='walk'?'inspect':'walk';syncWalkUI();});
 full.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();enterFullscreen();});
 tools.append(speed,full);root.append(tools);

 const joystick=document.createElement('div');
 const knob=document.createElement('div');
 Object.assign(joystick.style,{position:'absolute',left:'18px',bottom:'24px',width:'118px',height:'118px',borderRadius:'50%',background:'rgba(255,255,255,.11)',border:'1px solid rgba(255,255,255,.28)',boxShadow:'inset 0 0 0 28px rgba(0,0,0,.08)',pointerEvents:coarse?'auto':'none',display:coarse?'block':'none',touchAction:'none',backdropFilter:'blur(3px)'});
 Object.assign(knob.style,{position:'absolute',left:'50%',top:'50%',width:'48px',height:'48px',marginLeft:'-24px',marginTop:'-24px',borderRadius:'50%',background:'rgba(255,255,255,.42)',border:'1px solid rgba(255,255,255,.62)',transform:'translate(0px,0px)'});
 joystick.append(knob);root.append(joystick);

 let joyId=null;
 const joyMove=e=>{
  if(e.pointerId!==joyId)return;
  const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;
  const max=r.width*.34,len=Math.hypot(dx,dy);
  if(len>max){dx*=max/len;dy*=max/len;}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  joyRight=dx/max;joyForward=-dy/max;
 };
 joystick.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();joyId=e.pointerId;joystick.setPointerCapture?.(joyId);joyMove(e);});
 joystick.addEventListener('pointermove',joyMove);
 const joyEnd=e=>{if(e.pointerId!==joyId)return;joyId=null;joyForward=joyRight=0;knob.style.transform='translate(0px,0px)';};
 joystick.addEventListener('pointerup',joyEnd);joystick.addEventListener('pointercancel',joyEnd);

 host.append(root);
 walkthroughUI={root,speed,joystick,help};
 syncWalkUI();
 return walkthroughUI;
}
createWalkthroughUI();

function entrance(){
 if(!config)return;
 mode='walk';orbit.enabled=false;document.exitPointerLock?.();
 for(const k in keys)delete keys[k];joyForward=joyRight=0;
 const f=entranceFrame(config);
 const [x,z]=safePoint(f.outside[0],f.outside[1]);
 camera.fov=WALK_FOV;
 camera.position.set(mm(x),mm(WALK_EYE_MM),mm(z));
 camera.lookAt(mm(f.center[0]),mm(WALK_EYE_MM),mm(f.center[1]));
 yaw=camera.rotation.y;pitch=0;ceiling.visible=true;setWallHeightMode('full');
 camera.updateProjectionMatrix();dirtyCamera=true;syncWalkUI();
}
function update(c){
 config=c;const sig=JSON.stringify([c.walls,c.rooms,c.floorPolygons,c.settings,c.entrance]);if(sig===signature)return;
 signature=sig;compiled=compileGeometry(c);clear(body);clear(labels);clear(ceiling);
 compiled.parts.forEach(segment);compiled.floors.forEach(floor);setWallHeightMode(wallHeightMode);
 config.rooms.filter(r=>!r.id.startsWith('bal')||r.expanded).forEach(label);
 if(signature===sig&&host.dataset.datasetRevision===undefined)entrance();
 host.dataset.datasetRevision=c.geometryRevision;host.dataset.geometryWallCount=c.walls.length;host.dataset.geometryPartCount=compiled.parts.length;host.dataset.livingLeft=String(entranceFrame(c).livingLeft);dirtyCamera=true;
}
function whole(){
 mode='overview';orbit.enabled=true;document.exitPointerLock?.();camera.fov=48;camera.position.set(15,15,19);
 orbit.target.set((config.bounds[0]+config.bounds[2])/2000,0,(config.bounds[1]+config.bounds[3])/2000);orbit.update();
 ceiling.visible=false;camera.updateProjectionMatrix();dirtyCamera=true;syncWalkUI();
}

// Desktop: click for pointer-lock, or hold-drag to look without pointer-lock.
// Touch: right half of the viewport is the look pad; joystick remains independent for multitouch.
renderer.domElement.style.touchAction='none';
renderer.domElement.addEventListener('click',e=>{
 if(mode!=='walk'||coarse||e.pointerType==='touch')return;
 renderer.domElement.requestPointerLock?.()?.catch(()=>{});
});
document.addEventListener('mousemove',e=>{
 if(document.pointerLockElement!==renderer.domElement||mode!=='walk')return;
 yaw-=e.movementX*.002;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002,-1.35,1.35);dirtyCamera=true;
});
renderer.domElement.addEventListener('pointerdown',e=>{
 if(mode!=='walk')return;
 if(e.pointerType==='touch'){
  const rect=renderer.domElement.getBoundingClientRect();
  if(e.clientX<rect.left+rect.width*.42)return;
  lookPointer=e.pointerId;lookLastX=e.clientX;lookLastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId);e.preventDefault();
 }else if(document.pointerLockElement!==renderer.domElement){
  mouseLookPointer=e.pointerId;mouseLastX=e.clientX;mouseLastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId);e.preventDefault();
 }
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(mode!=='walk')return;
 if(e.pointerId===lookPointer){
  const dx=e.clientX-lookLastX,dy=e.clientY-lookLastY;lookLastX=e.clientX;lookLastY=e.clientY;
  yaw-=dx*.0042;pitch=THREE.MathUtils.clamp(pitch-dy*.0042,-1.35,1.35);dirtyCamera=true;e.preventDefault();
 }else if(e.pointerId===mouseLookPointer){
  const dx=e.clientX-mouseLastX,dy=e.clientY-mouseLastY;mouseLastX=e.clientX;mouseLastY=e.clientY;
  yaw-=dx*.003;pitch=THREE.MathUtils.clamp(pitch-dy*.003,-1.35,1.35);dirtyCamera=true;e.preventDefault();
 }
});
const endLook=e=>{if(e.pointerId===lookPointer)lookPointer=null;if(e.pointerId===mouseLookPointer)mouseLookPointer=null;};
renderer.domElement.addEventListener('pointerup',endLook);renderer.domElement.addEventListener('pointercancel',endLook);

window.addEventListener('keydown',e=>{
 if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(mode==='walk'&&['KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys[e.code]=true;}
});
window.addEventListener('keyup',e=>delete keys[e.code]);
const resetKeys=()=>{for(const k in keys)delete keys[k];joyForward=joyRight=0;};
window.addEventListener('blur',resetKeys);
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement!==renderer.domElement)resetKeys();});

function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirtyCamera=true;}
new ResizeObserver(resize).observe(host);
const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
 const dt=Math.min(clock.getDelta(),.05);if(!config)return;
 if(mode==='walk'){
  enforceEyeHeight();
  camera.rotation.set(pitch,yaw,0,'YXZ');
  let f=((keys.KeyW?1:0)-(keys.KeyS?1:0))+joyForward;
  let r=((keys.KeyD?1:0)-(keys.KeyA?1:0))+joyRight;
  let norm=Math.hypot(f,r);
  if(norm){
   if(norm>1){f/=norm;r/=norm;}
   const baseSpeed=Number(config.settings.speed)||1200;
   const dist=baseSpeed*walkSpeedFactor()*dt;
   const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*dist;
   const dz=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*dist;
   const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/40));
   for(let i=0;i<n;i++){
    let x=camera.position.x*1000,z=camera.position.z*1000;
    if(!blocked(config,compiled,[x+dx/n,z]))camera.position.x+=mm(dx/n);
    x=camera.position.x*1000;
    if(!blocked(config,compiled,[x,z+dz/n]))camera.position.z+=mm(dz/n);
   }
   enforceEyeHeight();dirtyCamera=true;
  }
 }else if(mode==='overview')orbit.update();
 const cs=cameraState(),ck=JSON.stringify(cs);
 if(ck===lastCamera&&!dirtyCamera)return;
 if(ck!==lastCamera){lastCamera=ck;onCameraChange?.(cs);}
 renderer.render(scene,camera);host.dataset.rendered='true';
 if(dirtyCamera){host.dataset.cameraPosition=camera.position.toArray().map(v=>Math.round(v*1000)).join(',');dirtyCamera=false;}
});
function cameraState(){return {position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),target:orbit.target.toArray(),fov:camera.fov,mode,ceilingVisible:ceiling.visible};}
function setCamera(s){
 if(JSON.stringify(cameraState())===JSON.stringify(s))return;
 mode=s.mode;orbit.enabled=mode==='overview';camera.position.fromArray(s.position);camera.quaternion.fromArray(s.quaternion);orbit.target.fromArray(s.target);camera.fov=s.fov;ceiling.visible=s.ceilingVisible;
 camera.updateProjectionMatrix();yaw=camera.rotation.y;pitch=camera.rotation.x;if(mode==='walk')enforceEyeHeight();dirtyCamera=true;syncWalkUI();
}
let lastCamera='';
let design;
function setDesign(data,enabled=true){if(!design)design=createDesignLayer(scene,data);design.setVisible(enabled);labels.visible=!enabled;host.dataset.designEnabled=String(enabled);dirtyCamera=true;}
function designCamera(p){mode='walk';orbit.enabled=false;document.exitPointerLock?.();camera.position.set(...p.position.map(mm));camera.position.y=mm(WALK_EYE_MM);camera.lookAt(mm(p.target[0]),mm(WALK_EYE_MM),mm(p.target[2]));camera.fov=WALK_FOV;ceiling.visible=true;setWallHeightMode('full');camera.updateProjectionMatrix();yaw=camera.rotation.y;pitch=camera.rotation.x;dirtyCamera=true;syncWalkUI();}
function setLightMode(warm){design?.setWarm(warm);sun.color.set(warm?'#ffe0b0':'#ffffff');fill.color.set(warm?'#fff0db':'#edf4ff');host.dataset.lightMode=warm?'warm':'day';dirtyCamera=true;}
return {update,setFurniture,setEntry,setKitchen,setBathroomKitchen,setDesign,designCamera,setLightMode,setWallHeightMode,entrance,whole,teleportWalk,cameraState,setCamera,source:()=>config,compiled:()=>compiled,screenshot:()=>renderer.domElement.toDataURL('image/png')};
}
