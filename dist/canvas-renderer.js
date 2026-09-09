// CPU projection fallback for devices without WebGL. Uses the same Three.js meshes/camera.
import * as THREE from './vendor/three.module.js';
export class CanvasRenderer{
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.shadowMap={};this.ratio=1;this.outputColorSpace=THREE.SRGBColorSpace;}
 setPixelRatio(r){this.ratio=r;}
 setSize(w,h){this.w=w;this.h=h;this.domElement.width=Math.round(w*this.ratio);this.domElement.height=Math.round(h*this.ratio);this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';}
 setAnimationLoop(fn){const loop=()=>{fn();requestAnimationFrame(loop);};requestAnimationFrame(loop);}
 render(scene,camera){const x=this.ctx,w=this.w,h=this.h;if(!w||!h)return;x.setTransform(this.ratio,0,0,this.ratio,0,0);x.fillStyle=scene.background?.getStyle()??'#e7edf0';x.fillRect(0,0,w,h);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const vp=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),items=[],labels=[];
 const project=(v,m)=>{const world=v.clone().applyMatrix4(m),view=world.clone().applyMatrix4(camera.matrixWorldInverse),p=world.applyMatrix4(vp);return {x:(p.x+1)*w/2,y:(1-p.y)*h/2,z:-view.z};};
 scene.traverseVisible(o=>{if(o.isSprite){const p=project(new THREE.Vector3(),o.matrixWorld);if(p.z>camera.near&&o.material.map?.image)labels.push({p,img:o.material.map.image,scale:o.scale.x});return;}if(!o.isMesh&&!o.isLineSegments)return;const attr=o.geometry.attributes.position,index=o.geometry.index,step=o.isLineSegments?2:3,count=index?index.count:attr.count;for(let i=0;i<count;i+=step){const points=[];for(let j=0;j<step;j++){const n=index?index.getX(i+j):i+j;points.push(project(new THREE.Vector3().fromBufferAttribute(attr,n),o.matrixWorld));}if(points.some(p=>p.z<=camera.near))continue;const mat=Array.isArray(o.material)?o.material[0]:o.material;items.push({points,z:points.reduce((a,p)=>a+p.z,0)/step,color:mat.color?.getStyle()??'#fafaf8',opacity:mat.opacity??1,line:o.isLineSegments});}});
 items.sort((a,b)=>b.z-a.z);for(const t of items){x.globalAlpha=t.opacity;x.beginPath();t.points.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));if(t.line){x.strokeStyle=t.color;x.lineWidth=1;x.stroke();}else{x.closePath();x.fillStyle=t.color;x.fill();}}
 x.globalAlpha=1;for(const l of labels){const width=l.scale*h/(2*Math.tan(camera.fov*Math.PI/360)*l.p.z),height=width/4;x.drawImage(l.img,l.p.x-width/2,l.p.y-height/2,width,height);}
 }
}
