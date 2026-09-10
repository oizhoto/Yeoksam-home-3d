import * as THREE from 'three';
import {CanvasRenderer} from './canvas-renderer.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {compileGeometry,entranceFrame,blocked} from './plan-core.js';
import {createFinishLibrary,materialForBox,MATERIAL_V1} from './materials.js';
import {createDesignLayer} from './design-layer.js';
export const APP_VERSION='V7.8';
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
const camera=new THREE.PerspectiveCamera(90,1,.03,100);camera.rotation.order='YXZ';const orbit=new OrbitControls(camera,renderer.domElement);orbit.enabled=false;orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI/2-.05;let config,compiled,signature='',mode='entry',yaw=0,pitch=0,dirtyCamera=true;const body=new THREE.Group(),labels=new THREE.Group(),ceiling=new THREE.Group(),furniture=new THREE.Group(),entryLayer=new THREE.Group(),kitchenLayer=new THREE.Group();scene.add(body,labels,ceiling,furniture,entryLayer,kitchenLayer);let furnitureItems=[],entryItems=[],kitchenItems=[];const mm=v=>v/1000,keys={};
function clear(g){g.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m?.userData?.owned){for(const key of ['map','bumpMap','roughnessMap'])m[key]?.dispose();m.dispose();}});g.clear();}
function segment(p){const dx=p.b[0]-p.a[0],dz=p.b[1]-p.a[1],len=Math.hypot(dx,dz),glass=p.kind==='glass',door=p.kind==='door';const material=glass?finishes.glass:materialForBox(door?finishes.film:finishes.wall,mm(len),mm(p.height),mm(p.thickness),door?MATERIAL_V1.film.tileMeters:MATERIAL_V1.wall.tileMeters);const m=new THREE.Mesh(new THREE.BoxGeometry(mm(len),mm(p.height),mm(p.thickness)),material);m.position.set(mm((p.a[0]+p.b[0])/2),mm(p.y+p.height/2),mm((p.a[1]+p.b[1])/2));m.rotation.y=-Math.atan2(dz,dx);m.userData.geometryId=p.id;m.castShadow=!glass;m.receiveShadow=true;if(!(config.unknownStructureDisplay==='wireframe'&&p.structureStatus==='STRUCTURE_UNCONFIRMED'))body.add(m);if(p.structureStatus==='STRUCTURE_UNCONFIRMED'){const edge=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:'#c17c16'}));edge.position.copy(m.position);edge.rotation.copy(m.rotation);body.add(edge);}}
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
 for(const o of kitchenItems){
  const [w,h,d]=o.size,[x,y,z]=o.position,mat=kitchenMaterial(o.type);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat);
  mesh.position.set(mm(x),mm(y+h/2),mm(z));mesh.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.kitchenId=o.id;kitchenLayer.add(mesh);
  if((o.type==='lowerCabinetRun'||o.type==='upperCabinetRun')&&Array.isArray(o.modules)){
   let cursor=-d/2;for(const module of o.modules.slice(0,-1)){cursor+=module;const gap=new THREE.Mesh(new THREE.BoxGeometry(.004,mm(h)*.96,.012),new THREE.MeshStandardMaterial({color:'#a8a39a',roughness:.9}));gap.position.set(-mm(w)/2-.007,0,mm(cursor));mesh.add(gap);}
  }
 }
}
function setKitchen(items=[]){kitchenItems=items;renderKitchen();}

function entrance(){if(!config)return;mode='entry';orbit.enabled=false;document.exitPointerLock?.();for(const k in keys)delete keys[k];const f=entranceFrame(config);camera.fov=config.settings.verificationFov;camera.position.set(mm(f.outside[0]),mm(config.settings.eyeHeight),mm(f.outside[1]));camera.lookAt(mm(f.center[0]),mm(config.settings.eyeHeight),mm(f.center[1]));yaw=camera.rotation.y;pitch=0;ceiling.visible=true;camera.updateProjectionMatrix();dirtyCamera=true;}
function update(c){config=c;const sig=JSON.stringify([c.walls,c.rooms,c.floorPolygons,c.settings,c.entrance]);if(sig===signature)return;signature=sig;compiled=compileGeometry(c);clear(body);clear(labels);clear(ceiling);compiled.parts.forEach(segment);compiled.floors.forEach(floor);config.rooms.filter(r=>!r.id.startsWith('bal')||r.expanded).forEach(label);if(signature===sig&&host.dataset.datasetRevision===undefined)entrance();host.dataset.datasetRevision=c.geometryRevision;host.dataset.geometryWallCount=c.walls.length;host.dataset.geometryPartCount=compiled.parts.length;host.dataset.livingLeft=String(entranceFrame(c).livingLeft);dirtyCamera=true;}
function whole(){mode='overview';orbit.enabled=true;document.exitPointerLock?.();camera.fov=48;camera.position.set(15,15,19);orbit.target.set((config.bounds[0]+config.bounds[2])/2000,0,(config.bounds[1]+config.bounds[3])/2000);orbit.update();ceiling.visible=false;camera.updateProjectionMatrix();dirtyCamera=true;}
renderer.domElement.addEventListener('click',()=>{if(mode==='overview')return;mode='walk';renderer.domElement.requestPointerLock?.()?.catch(()=>{});});document.addEventListener('mousemove',e=>{if(document.pointerLockElement!==renderer.domElement)return;yaw-=e.movementX*.002;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002,-1.45,1.45);});window.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(document.pointerLockElement===renderer.domElement&&['KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys[e.code]=true;}});window.addEventListener('keyup',e=>delete keys[e.code]);const resetKeys=()=>{for(const k in keys)delete keys[k];};window.addEventListener('blur',resetKeys);document.addEventListener('pointerlockchange',resetKeys);
function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirtyCamera=true;}new ResizeObserver(resize).observe(host);const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);if(!config)return;if(mode==='walk'){camera.rotation.set(pitch,yaw,0,'YXZ');let f=(keys.KeyW?1:0)-(keys.KeyS?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0),norm=Math.hypot(f,r);if(norm){f/=norm;r/=norm;const dist=config.settings.speed*dt,dx=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*dist,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*dist,n=Math.ceil(dist/40);for(let i=0;i<n;i++){let x=camera.position.x*1000,z=camera.position.z*1000;if(!blocked(config,compiled,[x+dx/n,z]))camera.position.x+=mm(dx/n);x=camera.position.x*1000;if(!blocked(config,compiled,[x,z+dz/n]))camera.position.z+=mm(dz/n);}}}else if(mode==='overview')orbit.update();const cs=cameraState(),ck=JSON.stringify(cs);if(ck===lastCamera&&!dirtyCamera)return;if(ck!==lastCamera){lastCamera=ck;onCameraChange?.(cs);}renderer.render(scene,camera);host.dataset.rendered='true';if(dirtyCamera){host.dataset.cameraPosition=camera.position.toArray().map(v=>Math.round(v*1000)).join(',');dirtyCamera=false;}});
function cameraState(){return {position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),target:orbit.target.toArray(),fov:camera.fov,mode,ceilingVisible:ceiling.visible};}
function setCamera(s){if(JSON.stringify(cameraState())===JSON.stringify(s))return;mode=s.mode;orbit.enabled=mode==='overview';camera.position.fromArray(s.position);camera.quaternion.fromArray(s.quaternion);orbit.target.fromArray(s.target);camera.fov=s.fov;ceiling.visible=s.ceilingVisible;camera.updateProjectionMatrix();yaw=camera.rotation.y;pitch=camera.rotation.x;dirtyCamera=true;}
let lastCamera='';
let design;
function setDesign(data,enabled=true){if(!design)design=createDesignLayer(scene,data);design.setVisible(enabled);labels.visible=!enabled;host.dataset.designEnabled=String(enabled);dirtyCamera=true;}
function designCamera(p){mode='entry';orbit.enabled=false;document.exitPointerLock?.();camera.position.set(...p.position.map(mm));camera.lookAt(...p.target.map(mm));camera.fov=p.fov;ceiling.visible=true;camera.updateProjectionMatrix();yaw=camera.rotation.y;pitch=camera.rotation.x;dirtyCamera=true;}
function setLightMode(warm){design?.setWarm(warm);sun.color.set(warm?'#ffe0b0':'#ffffff');fill.color.set(warm?'#fff0db':'#edf4ff');host.dataset.lightMode=warm?'warm':'day';dirtyCamera=true;}
return {update,setFurniture,setEntry,setKitchen,setDesign,designCamera,setLightMode,entrance,whole,cameraState,setCamera,source:()=>config,compiled:()=>compiled,screenshot:()=>renderer.domElement.toDataURL('image/png')};
}
