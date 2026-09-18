import * as THREE from 'three';
import { CONFIG } from './config.js';
import { ring } from './models.js';
export class Effects {
  constructor(scene,camera,settings){
    this.scene=scene;this.camera=camera;this.settings=settings;this.shake=0;this.particles=[];this.active=new Set();this.cursor=0;
    this.geometry=new THREE.IcosahedronGeometry(1,0);this.material=new THREE.MeshBasicMaterial({vertexColors:false,transparent:true,opacity:.85,depthWrite:false});
    this.mesh=new THREE.InstancedMesh(this.geometry,this.material,CONFIG.effects.high);this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;scene.add(this.mesh);this.dummy=new THREE.Object3D();this.color=new THREE.Color();this.limit=CONFIG.effects.high;
    for(let i=0;i<CONFIG.effects.high;i++){this.particles.push({life:0});this.dummy.scale.setScalar(0);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);this.mesh.setColorAt(i,this.color);}
    this.rings=Array.from({length:6},()=>{const m=ring(scene,0xffdf9c);m.material=m.material.clone();m.material.transparent=true;m.material.depthWrite=false;m.material.toneMapped=false;m.visible=false;return {mesh:m,life:0,max:.38};});
    this.popups=Array.from({length:CONFIG.effects.popups},()=>{const element=document.createElement('span');element.className='score-popup';element.hidden=true;document.getElementById('popups').append(element);return {element,life:0};});
    this.project=new THREE.Vector3();
  }
  emit(x,y,z,color,count=8,life=.6,size=1){const limit=this.limit;
    for(let i=0;i<count;i++){this.cursor=(this.cursor+1)%limit;const p=this.particles[this.cursor];Object.assign(p,{x,y,z,vx:(Math.random()-.5)*5,vy:1+Math.random()*4,vz:(Math.random()-.5)*5,life,max:life,size:(.05+Math.random()*.15)*size,color});this.active.add(this.cursor);this.mesh.setColorAt(this.cursor,this.color.setHex(color));}this.mesh.instanceColor.needsUpdate=true;
  }
  setQuality(){this.limit=CONFIG.effects.high;this.mesh.count=this.limit;}
  explosion(x,z,size=1){this.emit(x,.7,z,0xffffff,Math.round(7*size),.16,1.6);this.emit(x,.5,z,0xffaa68,Math.round(10*size),.42,1.25);this.emit(x,.2,z,0x8f9490,Math.round(7*size),.78,1.45);const r=this.rings.find(r=>r.life<=0)||this.rings[0];r.life=r.max;r.mesh.material.opacity=.8;r.mesh.position.set(x,.1,z);r.mesh.visible=true;r.size=size;this.shake=Math.max(this.shake,.1*size);}
  popup(x,z,text,color='#fff9d5'){const p=this.popups.find(p=>p.life<=0)||this.popups[0];Object.assign(p,{x,z,life:1.2});p.element.textContent=text;p.element.style.color=color;p.element.hidden=false;}
  update(dt){this.shake=Math.max(0,this.shake-dt);let changed=false;for(const i of this.active){const p=this.particles[i];p.life=Math.max(0,p.life-dt);if(p.life>0){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=6*dt;this.dummy.position.set(p.x,Math.max(.07,p.y),p.z);this.dummy.rotation.set(0,0,0);this.dummy.scale.setScalar(p.size*Math.min(1,p.life*4));}else{this.dummy.scale.setScalar(0);this.active.delete(i);}this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);changed=true;}if(changed)this.mesh.instanceMatrix.needsUpdate=true;
    for(const r of this.rings)if(r.life>0){r.life=Math.max(0,r.life-dt);r.mesh.visible=r.life>0;r.mesh.scale.setScalar((r.max-r.life)*8*r.size);r.mesh.material.opacity=.8*r.life/r.max;}
    for(const p of this.popups)if(p.life>0){p.life-=dt;p.element.hidden=p.life<=0;}
  }
  render(){for(const p of this.popups)if(p.life>0){this.project.set(p.x,2+(1.2-p.life),p.z).project(this.camera);p.element.style.transform=`translate(${(this.project.x*.5+.5)*innerWidth}px,${(-this.project.y*.5+.5)*innerHeight}px) translate(-50%,-50%)`;p.element.style.opacity=Math.min(1,p.life*3);}}
  clear(){for(const i of this.active){const p=this.particles[i];p.life=0;this.dummy.scale.setScalar(0);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);}this.active.clear();this.mesh.instanceMatrix.needsUpdate=true;for(const p of this.popups){p.life=0;p.element.hidden=true;}for(const r of this.rings){r.life=0;r.mesh.visible=false;}this.shake=0;}
}
