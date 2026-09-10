import * as THREE from 'three';
const mm=v=>v/1000;
export function createDesignLayer(scene,data){
  const root=new THREE.Group();root.name=data.id;scene.add(root);
  const white=new THREE.MeshStandardMaterial({color:data.palette.ceiling,roughness:.82});
  const dark=new THREE.MeshStandardMaterial({color:'#363c3c',roughness:.6});
  const glow=new THREE.MeshStandardMaterial({color:'#fff6e5',emissive:'#fff0d0',emissiveIntensity:1.5});
  function box(parent,size,pos,mat=white){const m=new THREE.Mesh(new THREE.BoxGeometry(...size.map(mm)),mat);m.position.set(...pos.map(mm));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function cylinder(parent,r,h,pos,mat=white){const m=new THREE.Mesh(new THREE.CylinderGeometry(mm(r),mm(r),mm(h),32),mat);m.position.set(...pos.map(mm));m.castShadow=true;parent.add(m);return m;}
  for(const f of data.fans){
    const g=new THREE.Group();g.position.set(...f.position.map(mm));g.userData.designId=f.id;root.add(g);
    cylinder(g,60,30,[0,115,0]);cylinder(g,14,90,[0,65,0]);cylinder(g,90,70,[0,0,0]);
    const s=new THREE.Shape();s.moveTo(55,-35);s.bezierCurveTo(200,-75,420,-95,f.radius,-25);s.bezierCurveTo(f.radius+5,35,260,95,70,40);s.closePath();
    const geo=new THREE.ExtrudeGeometry(s,{depth:8,bevelEnabled:true,bevelSize:3,bevelThickness:2,bevelSegments:2,steps:1});geo.scale(.001,.001,.001);geo.rotateX(-Math.PI/2);
    for(let i=0;i<3;i++){const b=new THREE.Mesh(geo,white);b.rotation.y=i*Math.PI*2/3;b.castShadow=true;g.add(b);}
  }
  for(const a of data.airConditioners){
    const g=new THREE.Group();g.position.set(...a.position.map(mm));g.userData.designId=a.id;root.add(g);box(g,a.size,[0,0,0]);
    box(g,[a.size[0]*.87,3,85],[0,-a.size[1]/2-2,90],dark);
    for(let i=0;i<4;i++)box(g,[a.size[0]*.84,4,8],[0,-a.size[1]/2-5,60+i*19]);
    for(let i=0;i<12;i++)box(g,[a.size[0]*.8,2,2],[0,-a.size[1]/2-1,-140+i*10],dark);
  }
  for(const p of data.downlights){cylinder(root,42,10,p);cylinder(root,31,11,[p[0],p[1]-2,p[2]],glow);const l=new THREE.SpotLight('#fff0d8',18,5,Math.PI/3,.65,2);l.position.set(...p.map(mm));l.target.position.set(mm(p[0]),0,mm(p[2]));root.add(l,l.target);}
  for(const b of data.curtainBoxes){box(root,b.size,b.position);box(root,[b.size[0]-60,4,12],[b.position[0],b.position[1]-b.size[1]/2-3,b.position[2]],glow);}
  box(root,data.cove.size,data.cove.position);box(root,[12,4,data.cove.size[2]-80],[data.cove.position[0]-35,data.cove.position[1]+43,data.cove.position[2]],glow);
  const coveLight=new THREE.PointLight('#ffe5c0',12,6,2);coveLight.position.set(7.6,2.12,8.64);root.add(coveLight);
  root.visible=false;
  return {root,setVisible:v=>root.visible=v,setWarm:w=>{root.traverse(o=>{if(o.isLight)o.color.set(w?'#ffe2b6':'#fff8ed');});glow.emissive.set(w?'#ffe2b6':'#fff8ed');}};
}
