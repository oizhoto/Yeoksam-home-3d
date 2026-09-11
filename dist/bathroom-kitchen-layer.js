import * as THREE from 'three';

const mm=v=>v/1000;

function mat(type){
  if(type==='chrome') return new THREE.MeshStandardMaterial({color:0xc2c7ca,roughness:.16,metalness:.92});
  if(type==='steel') return new THREE.MeshStandardMaterial({color:0xaeb5b8,roughness:.26,metalness:.82});
  if(type==='glass') return new THREE.MeshPhysicalMaterial({color:0xe7eef0,roughness:.12,metalness:.08,transparent:true,opacity:.58});
  if(type==='mirror') return new THREE.MeshPhysicalMaterial({color:0xdbe4e4,roughness:.08,metalness:.42,clearcoat:.55,clearcoatRoughness:.08});
  if(type==='black') return new THREE.MeshStandardMaterial({color:0x22201e,roughness:.24,metalness:.05});
  if(type==='tile') return new THREE.MeshStandardMaterial({color:0xd9d0c4,roughness:.86,metalness:0});
  if(type==='ledge') return new THREE.MeshStandardMaterial({color:0xddd4c8,roughness:.72,metalness:0});
  if(type==='moodBeige') return new THREE.MeshStandardMaterial({color:0xd8cec0,roughness:.74,metalness:0});
  if(type==='warmWhite') return new THREE.MeshStandardMaterial({color:0xeeeae3,roughness:.78,metalness:0});
  if(type==='cabinet') return new THREE.MeshStandardMaterial({color:0xe8e1d8,roughness:.72,metalness:0});
  if(type==='shadow') return new THREE.MeshStandardMaterial({color:0x4c4842,roughness:.90,metalness:0});
  return new THREE.MeshStandardMaterial({color:0xf4f1eb,roughness:.52,metalness:0});
}
function box(size,materialType='white'){
  const [w,h,d]=size;
  const o=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(d)),mat(materialType));
  o.castShadow=true;o.receiveShadow=true;return o;
}
function place(o,pos,rot=0,size=null){
  const [x,y,z]=pos,h=size?.[1]||0;
  o.position.set(mm(x),mm(y+h/2),mm(z));
  o.rotation.y=THREE.MathUtils.degToRad(rot||0);
  return o;
}
function roundedRectShape(w,d,r=28,hole=0){
  const s=new THREE.Shape(),x=-mm(w)/2,z=-mm(d)/2,W=mm(w),D=mm(d),R=Math.min(mm(r),W/2,D/2);
  s.moveTo(x+R,z);s.lineTo(x+W-R,z);s.quadraticCurveTo(x+W,z,x+W,z+R);s.lineTo(x+W,z+D-R);s.quadraticCurveTo(x+W,z+D,x+W-R,z+D);s.lineTo(x+R,z+D);s.quadraticCurveTo(x,z+D,x,z+D-R);s.lineTo(x,z+R);s.quadraticCurveTo(x,z,x+R,z);
  if(hole){const hw=w-hole*2,hd=d-hole*2,hr=Math.max(8,r-hole),p=new THREE.Path(),hx=-mm(hw)/2,hz=-mm(hd)/2,H=mm(hw),K=mm(hd),Q=mm(hr);p.moveTo(hx+Q,hz);p.lineTo(hx+H-Q,hz);p.quadraticCurveTo(hx+H,hz,hx+H,hz+Q);p.lineTo(hx+H,hz+K-Q);p.quadraticCurveTo(hx+H,hz+K,hx+H-Q,hz+K);p.lineTo(hx+Q,hz+K);p.quadraticCurveTo(hx,hz+K,hx,hz+K-Q);p.lineTo(hx,hz+Q);p.quadraticCurveTo(hx,hz,hx+Q,hz);s.holes.push(p);}
  return s;
}
function roundedSlab(w,h,d,r,material,hole=0){const geo=new THREE.ExtrudeGeometry(roundedRectShape(w,d,r,hole),{depth:mm(h),bevelEnabled:true,bevelSize:mm(3),bevelThickness:mm(3),bevelSegments:2});geo.rotateX(Math.PI/2);const m=new THREE.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;return m;}
function tube(points,r=10,material=mat('chrome')){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(mm(p[0]),mm(p[1]),mm(p[2])))),28,mm(r),10,false),material);}
function toilet(obj){
  const g=new THREE.Group(), white=mat('white');
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(mm(135),mm(165),mm(330),28),white);
  pedestal.scale.z=1.18;pedestal.position.y=mm(165);g.add(pedestal);
  const bowl=new THREE.Mesh(new THREE.SphereGeometry(mm(190),32,18),white);
  bowl.scale.set(1,.50,1.38);bowl.position.set(0,mm(390),mm(65));g.add(bowl);
  const lid=new THREE.Mesh(new THREE.TorusGeometry(mm(145),mm(18),10,34),white);
  lid.rotation.x=Math.PI/2;lid.scale.z=1.28;lid.position.set(0,mm(448),mm(72));g.add(lid);
  const tank=box([obj.size[0]-30,310,150],'white');
  tank.position.set(0,mm(530),mm(-obj.size[2]/2+85));g.add(tank);
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(obj.rotationY||0);return g;
}
function tub(obj){
  const [w,h,d]=obj.size,g=new THREE.Group();
  const apron=roundedSlab(w,h-75,d,58,mat('white'));apron.position.y=mm((h-75)/2);g.add(apron);
  const shell=roundedSlab(w,90,d,70,mat('white'),70);shell.position.y=mm(h-45);g.add(shell);
  const well=roundedSlab(w-135,24,d-135,45,mat('tile'));well.position.y=mm(h-105);g.add(well);
  const drain=new THREE.Mesh(new THREE.CylinderGeometry(mm(24),mm(24),mm(5),28),mat('chrome'));drain.position.set(mm(w*.28),mm(h-88),0);g.add(drain);
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));g.rotation.y=THREE.MathUtils.degToRad(obj.rotationY||0);return g;
}
function faucet(obj,kitchen=false){
  const g=new THREE.Group(), chrome=mat('chrome'),H=obj.size[1]||300;
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(mm(15),mm(18),mm(H*.7),24),chrome);stem.position.y=mm(H*.35);g.add(stem);
  g.add(tube([[0,H*.65,0],[0,H,0],[0,H+(kitchen?100:45),kitchen?80:45],[0,H*.76,kitchen?175:115]],kitchen?13:11,chrome));
  const lever=new THREE.Mesh(new THREE.CylinderGeometry(mm(7),mm(7),mm(90),16),chrome);lever.rotation.z=Math.PI/2;lever.position.set(mm(45),mm(H*.42),0);g.add(lever);
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));return g;
}
function fridgeWall(obj){
  const [w,h,d]=obj.size,g=new THREE.Group(),upper=obj.upperStorageHeight||430,lowerH=h-upper;
  const carcass=box([w,h,d],'moodBeige');carcass.position.y=mm(h/2);g.add(carcass);
  const modules=obj.modules||[w*.39,w*.61];let cursor=-w/2;
  modules.forEach((moduleW,i)=>{const cx=cursor+moduleW/2;
    const door=box([moduleW-10,lowerH-28,d+14],i===0?'moodBeige':'warmWhite');door.position.set(mm(cx),mm((lowerH-28)/2+12),mm(7));g.add(door);
    if(i===0){for(const [cy,ch] of [[520,390],[1000,420]]){const frame=box([moduleW-56,ch,d+24],'black');frame.position.set(mm(cx),mm(cy),mm(12));g.add(frame);const glass=box([moduleW-86,ch-46,d+28],'mirror');glass.position.set(mm(cx),mm(cy),mm(15));g.add(glass);}}
    else {const seam=box([moduleW-42,4,d+22],'shadow');seam.position.set(mm(cx),mm(lowerH*.52),mm(12));g.add(seam);for(const sx of [-1,1]){const grip=box([12,390,18],'shadow');grip.position.set(mm(cx+sx*18),mm(lowerH*.52),mm(d/2+18));g.add(grip);}}
    const top=box([moduleW-10,upper-18,d+14],'moodBeige');top.position.set(mm(cx),mm(h-upper/2),mm(7));g.add(top);cursor+=moduleW;
  });
  g.position.set(mm(obj.position[0]),mm(obj.position[1]),mm(obj.position[2]));g.rotation.y=THREE.MathUtils.degToRad(obj.rotationY||0);return g;
}
function trueInsetSink(o){
  const g=new THREE.Group(), steel=mat('steel');
  const bottom=new THREE.Mesh(new THREE.BoxGeometry(mm(o.size[0]-70),mm(18),mm(o.size[2]-70)),steel);
  bottom.position.y=mm(-165);g.add(bottom);
  const wallT=18,h=150,w=o.size[0]-70,d=o.size[2]-70;
  for(const sign of [-1,1]){
    const s=new THREE.Mesh(new THREE.BoxGeometry(mm(w),mm(h),mm(wallT)),steel);
    s.position.set(0,mm(-82),mm(sign*(d/2-wallT/2)));g.add(s);
    const e=new THREE.Mesh(new THREE.BoxGeometry(mm(wallT),mm(h),mm(d)),steel);
    e.position.set(mm(sign*(w/2-wallT/2)),mm(-82),0);g.add(e);
  }
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function wallCabinet(o){
  const g=new THREE.Group(), carcass=box(o.size,'cabinet');
  carcass.position.y=mm(o.size[1]/2);g.add(carcass);
  const n=o.doorCount||4, panelW=o.size[0]/n;
  for(let i=0;i<n;i++){
    const p=box([panelW-8,o.size[1]-18,10],'mirror');
    p.position.set(mm(-o.size[0]/2+panelW*(i+.5)),mm(o.size[1]/2),mm(o.size[2]/2+5));g.add(p);
  }
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function vanity(o){
  const g=new THREE.Group(), [w,h,d]=o.size;
  const body=box([w,h-110,d],'moodBeige');body.position.y=mm((h-110)/2+90);g.add(body);
  const front=box([w-14,h-135,18],'moodBeige');
  front.position.set(0,mm((h-135)/2+92),mm(d/2+9));g.add(front);
  const reveal=box([w-36,5,24],'shadow');reveal.position.set(0,mm(h-92),mm(d/2+12));g.add(reveal);
  const plinth=box([w-100,50,d-80],'shadow');plinth.position.set(0,mm(25),mm(-20));g.add(plinth);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function ledge(o){
  const g=new THREE.Group();
  const slab=box([o.size[0],o.size[1],o.size[2]],'ledge');slab.position.y=mm(o.size[1]/2);g.add(slab);
  const edge=box([o.size[0]-10,12,o.size[2]+8],'warmWhite');edge.position.y=mm(o.size[1]-6);g.add(edge);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function insetBasin(o){
  const g=new THREE.Group();
  const rim=new THREE.Mesh(new THREE.TorusGeometry(mm(145),mm(20),10,36),mat('white'));
  rim.rotation.x=Math.PI/2;rim.scale.x=1.48;g.add(rim);
  const bowl=new THREE.Mesh(new THREE.SphereGeometry(mm(155),28,16,0,Math.PI*2,0,Math.PI/2),mat('white'));
  bowl.scale.set(1.48,.50,1.0);bowl.rotation.x=Math.PI;bowl.position.y=mm(-42);g.add(bowl);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function towelBar(o){
  const g=new THREE.Group(),chrome=mat('chrome');
  const rail=new THREE.Mesh(new THREE.CylinderGeometry(mm(10),mm(10),mm(o.size[0]),18),chrome);
  rail.rotation.z=Math.PI/2;g.add(rail);
  for(const sx of [-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(mm(8),mm(8),mm(70),16),chrome);p.rotation.x=Math.PI/2;p.position.set(mm(sx*(o.size[0]/2-30)),0,mm(35));g.add(p);}
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function paperHolder(o){
  const g=new THREE.Group(),chrome=mat('chrome');
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(mm(8),mm(8),mm(150),16),chrome);arm.rotation.z=Math.PI/2;g.add(arm);
  const roll=new THREE.Mesh(new THREE.CylinderGeometry(mm(55),mm(55),mm(105),24),mat('white'));roll.rotation.z=Math.PI/2;roll.position.x=mm(30);g.add(roll);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function showerSet(o){
  const g=new THREE.Group(),chrome=mat('chrome');
  const rail=new THREE.Mesh(new THREE.CylinderGeometry(mm(14),mm(14),mm(1750),20),chrome);rail.position.y=mm(950);g.add(rail);
  const head=new THREE.Mesh(new THREE.CylinderGeometry(mm(120),mm(120),mm(18),28),chrome);head.rotation.x=Math.PI/2;head.position.set(0,mm(1770),mm(80));g.add(head);
  const mixer=box([220,80,70],'chrome');mixer.position.set(0,mm(900),mm(45));g.add(mixer);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function towel(o){
  const g=new THREE.Group(), cloth=box(o.size,'warmWhite');cloth.position.y=mm(-o.size[1]/2);g.add(cloth);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function glassDoor(o){
  const g=new THREE.Group(),panel=box(o.size,'glass');panel.position.y=mm(o.size[1]/2);g.add(panel);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(mm(20),mm(o.size[1]),mm(20)),mat('chrome'));
  edge.position.set(0,mm(o.size[1]/2),mm(-o.size[2]/2+10));g.add(edge);
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(mm(10),mm(10),mm(220),16),mat('chrome'));
  handle.position.set(mm(35),mm(1050),mm(o.size[2]/2-80));g.add(handle);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function genericPlaced(o, materialType='white'){return place(box(o.size,materialType),o.position,o.rotationY,o.size);}

function detailKitchenLower(o){
  const g=new THREE.Group(), [w,h,d]=o.size;
  let cursor=-d/2;
  o.modules.forEach((mw,i)=>{
    const kind=o.moduleKinds?.[i]||'drawer', zc=cursor+mw/2;
    if(kind==='dishwasher'){
      const face=box([18,h-95,mw-12],'steel');face.position.set(mm(-w/2-9),mm((h-95)/2+80),mm(zc));g.add(face);
      const strip=box([22,48,mw-28],'black');strip.position.set(mm(-w/2-13),mm(h-78),mm(zc));g.add(strip);
    }else{
      const front=box([18,h-115,mw-10],'moodBeige');front.position.set(mm(-w/2-9),mm((h-115)/2+92),mm(zc));g.add(front);
      const groove=box([22,5,mw-30],'shadow');groove.position.set(mm(-w/2-13),mm(h-92),mm(zc));g.add(groove);
      if(kind==='drawer'){
        const split=box([22,4,mw-24],'shadow');split.position.set(mm(-w/2-13),mm(430),mm(zc));g.add(split);
      }
    }
    cursor+=mw;
  });
  const toe=box([70,o.toeKick||90,d-35],'shadow');toe.position.set(mm(-w/2+40),mm((o.toeKick||90)/2),0);g.add(toe);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function detailKitchenUpper(o){
  const g=new THREE.Group(), [w,h,d]=o.size;let cursor=-d/2;
  o.modules.forEach(mw=>{
    const zc=cursor+mw/2;
    const front=box([18,h-12,mw-8],'moodBeige');front.position.set(mm(-w/2-9),mm(h/2),mm(zc));g.add(front);
    const bottomGrip=box([22,5,mw-28],'shadow');bottomGrip.position.set(mm(-w/2-13),mm(22),mm(zc));g.add(bottomGrip);
    cursor+=mw;
  });
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function detailWardrobe(o){
  const g=new THREE.Group(), [w,h,d]=o.size,n=o.doorCount||5,panel=d/n;
  for(let i=0;i<n;i++){
    const z=-d/2+panel*(i+.5);
    const front=box([18,h-(o.plinth||70)-(o.ceilingFiller||35)-18,panel-8],'warmWhite');
    front.position.set(mm(w/2+9),mm((h-(o.plinth||70)-(o.ceilingFiller||35)-18)/2+(o.plinth||70)),mm(z));g.add(front);
    const groove=box([22,h-(o.plinth||70)-(o.ceilingFiller||35)-60,3],'shadow');
    groove.position.set(mm(w/2+13),mm(h/2),mm(z+panel/2-3));g.add(groove);
  }
  const plinth=box([70,o.plinth||70,d-20],'shadow');plinth.position.set(mm(w/2-35),mm((o.plinth||70)/2),0);g.add(plinth);
  const filler=box([25,o.ceilingFiller||35,d-10],'warmWhite');filler.position.set(mm(w/2+5),mm(h-(o.ceilingFiller||35)/2),0);g.add(filler);
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}
function detailEntryCabinet(o){
  const g=new THREE.Group(), [w,h,d]=o.size,n=o.doorCount||2,panel=w/n;
  const faces=[-1,1];
  for(const side of faces){
    for(let i=0;i<n;i++){
      const x=-w/2+panel*(i+.5);
      const front=box([panel-10,h-20,16],'moodBeige');
      front.position.set(mm(x),mm(h/2),mm(side*(d/2+8)));g.add(front);
    }
    if(o.niche){
      const nw=w*(o.niche.widthRatio||.82);
      const recess=box([nw,o.niche.height,24],'ledge');
      recess.position.set(0,mm(o.niche.y+o.niche.height/2),mm(side*(d/2+14)));g.add(recess);
      const top=box([nw+28,18,32],'shadow');top.position.set(0,mm(o.niche.y+o.niche.height),mm(side*(d/2+17)));g.add(top);
    }
  }
  g.position.set(mm(o.position[0]),mm(o.position[1]),mm(o.position[2]));
  g.rotation.y=THREE.MathUtils.degToRad(o.rotationY||0);return g;
}

export function buildBathroomKitchenLayer(data){
  const root=new THREE.Group();root.name='V8.25-reference-builtins';

  for(const room of data.bathrooms||[]){
    for(const o of room.objects||[]){
      let mesh;
      if(o.type==='bathtub') mesh=tub(o);
      else if(o.type==='toilet') mesh=toilet(o);
      else if(o.type==='deckFaucet') mesh=faucet(o,false);
      else if(o.type==='insetBasin') mesh=insetBasin(o);
      else if(o.type==='vanity') mesh=vanity(o);
      else if(o.type==='ledge') mesh=ledge(o);
      else if(o.type==='towel') mesh=towel(o);
      else if(o.type==='glassDoor') mesh=glassDoor(o);
      else if(o.type==='showerSet') mesh=showerSet(o);
      else if(o.type==='wallCabinet') mesh=wallCabinet(o);
      else if(o.type==='towelBar') mesh=towelBar(o);
      else if(o.type==='paperHolder') mesh=paperHolder(o);
      else if(o.type==='glassPanel') mesh=genericPlaced(o,'glass');
      else if(o.type==='showerTray') mesh=genericPlaced(o,'white');
      else mesh=genericPlaced(o,'white');
      mesh.userData.fixtureId=o.id;root.add(mesh);
    }
  }

  for(const o of data.kitchen?.objects||[]){
    let mesh;
    if(o.type==='fridgeWall') mesh=fridgeWall(o);
    else if(o.type==='kitchenFaucet') mesh=faucet(o,true);
    else if(o.type==='trueInsetSinkBowl') mesh=trueInsetSink(o);
    else mesh=genericPlaced(o,o.type==='induction'?'black':'white');
    mesh.userData.fixtureId=o.id;root.add(mesh);
  }

  for(const o of data.referenceDetails||[]){
    let mesh;
    if(o.type==='detailKitchenLower') mesh=detailKitchenLower(o);
    else if(o.type==='detailKitchenUpper') mesh=detailKitchenUpper(o);
    else if(o.type==='detailWardrobe') mesh=detailWardrobe(o);
    else if(o.type==='detailEntryCabinet') mesh=detailEntryCabinet(o);
    if(mesh){mesh.userData.referenceDetailId=o.id;root.add(mesh);}
  }

  return root;
}
