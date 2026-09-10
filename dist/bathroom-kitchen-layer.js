import * as THREE from 'three';

const mm=v=>v/1000;
function mat(type){
  if(type==='chrome') return new THREE.MeshStandardMaterial({color:0xc2c7ca,roughness:.16,metalness:.92});
  if(type==='steel') return new THREE.MeshStandardMaterial({color:0xaeb5b8,roughness:.26,metalness:.82});
  if(type==='glass') return new THREE.MeshPhysicalMaterial({color:0xe7eef0,roughness:.12,metalness:.08,transparent:true,opacity:.58});
  if(type==='black') return new THREE.MeshStandardMaterial({color:0x111214,roughness:.14,metalness:.08});
  if(type==='tile') return new THREE.MeshStandardMaterial({color:0xd8d0c3,roughness:.82,metalness:0});
  if(type==='cabinet') return new THREE.MeshStandardMaterial({color:0xf0efeb,roughness:.64,metalness:0});
  return new THREE.MeshStandardMaterial({color:0xf4f2ed,roughness:.50,metalness:0});
}
function box(size,materialType='white'){
  const [w,h,d]=size;
  const o=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat(materialType));
  o.castShadow=true;o.receiveShadow=true;return o;
}
function place(o,pos,rot=0,size=null){
  const [x,y,z]=pos;
  const h=size?.[1]||0;
  o.position.set(mm(x),mm(y+h/2),mm(z));
  o.rotation.y=THREE.MathUtils.degToRad(rot||0);
  return o;
}
function toilet(obj){
  const g=new THREE.Group();
  const base=box([obj.size[0],380,obj.size[2]],'white');base.position.y=mm(190);g.add(base);
  const tank=box([obj.size[0],350,180],'white');tank.position.set(0,mm(535),mm(-obj.size[2]/2+90));g.add(tank);
  const seat=new THREE.Mesh(new THREE.TorusGeometry(mm(145),mm(25),10,30),mat('white'));
  seat.rotation.x=Math.PI/2;seat.position.set(0,mm(410),mm(80));g.add(seat);
  const [x,y,z]=obj.position;g.position.set(mm(x),mm(y),mm(z));g.rotation.y=THREE.MathUtils.degToRad(obj.rotationY||0);return g;
}
function tub(obj){
  const [w,h,d]=obj.size,g=new THREE.Group();
  const outer=box([w,h,d],'white');outer.position.y=mm(h/2);g.add(outer);
  const inner=box([w-120,h*.55,d-120],'tile');inner.position.set(0,mm(h*.70),0);g.add(inner);
  const [x,y,z]=obj.position;g.position.set(mm(x),mm(y),mm(z));g.rotation.y=THREE.MathUtils.degToRad(obj.rotationY||0);return g;
}
function faucet(obj,kitchen=false){
  const g=new THREE.Group(), chrome=mat('chrome');
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(mm(18),mm(18),mm(obj.size[1]||300),24),chrome);
  stem.position.y=mm((obj.size[1]||300)/2);g.add(stem);
  const spout=new THREE.Mesh(new THREE.TorusGeometry(mm(kitchen?115:70),mm(16),10,28,Math.PI),chrome);
  spout.rotation.z=Math.PI/2;spout.position.set(0,mm(kitchen?300:230),mm(kitchen?70:45));g.add(spout);
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));return g;
}
function fridgeWall(obj){
  const [w,h,d]=obj.size,g=new THREE.Group(), upper=obj.upperStorageHeight||430, lowerH=h-upper;
  const carcass=box([w,h,d],'cabinet');carcass.position.y=mm(h/2);g.add(carcass);
  const moduleW=w/3;
  for(let i=0;i<3;i++){
    const door=box([moduleW-18,lowerH-35,d+8],'white');
    door.position.set(mm(-w/2+moduleW*(i+.5)),mm((lowerH-35)/2+15),mm(4));g.add(door);
  }
  const top=box([w-18,upper-25,d+8],'cabinet');top.position.set(0,mm(h-upper/2),mm(4));g.add(top);
  for(let i=1;i<3;i++){
    const seam=box([5,lowerH-25,d+12],'black');seam.position.set(mm(-w/2+moduleW*i),mm(lowerH/2),mm(6));g.add(seam);
  }
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));return g;
}
export function buildBathroomKitchenLayer(data){
  const root=new THREE.Group();root.name='V8.0-bathroom-kitchen-detail';
  for(const room of data.bathrooms||[]){
    for(const o of room.objects||[]){
      let mesh;
      if(o.type==='bathtub') mesh=tub(o);
      else if(o.type==='toilet') mesh=toilet(o);
      else if(o.type==='faucet') mesh=faucet(o,false);
      else if(o.type==='showerSet'){
        mesh=new THREE.Group();
        const rail=new THREE.Mesh(new THREE.CylinderGeometry(mm(14),mm(14),mm(1750),20),mat('chrome'));rail.position.y=mm(950);mesh.add(rail);
        const head=new THREE.Mesh(new THREE.CylinderGeometry(mm(120),mm(120),mm(18),28),mat('chrome'));head.rotation.x=Math.PI/2;head.position.set(0,mm(1770),mm(80));mesh.add(head);
        mesh.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
      } else {
        const mt=o.type==='mirrorCabinet'?'glass':o.type==='vanity'?'cabinet':'white';
        mesh=place(box(o.size,mt),o.position,o.rotationY,o.size);
      }
      mesh.userData.fixtureId=o.id;root.add(mesh);
    }
  }
  for(const o of data.kitchen?.objects||[]){
    let mesh;
    if(o.type==='fridgeWall') mesh=fridgeWall(o);
    else if(o.type==='kitchenFaucet') mesh=faucet(o,true);
    else {
      const mt=o.type==='sinkBowl'?'steel':o.type==='induction'?'black':'white';
      mesh=place(box(o.size,mt),o.position,o.rotationY,o.size);
    }
    mesh.userData.fixtureId=o.id;root.add(mesh);
  }
  return root;
}
