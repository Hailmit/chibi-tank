import * as THREE from 'three';
import { CONFIG } from './config.js';
import { Grid, TILE, clamp } from './core.js';
import { part, tileModel } from './models.js';
function radialTexture(inner,outer){const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const context=canvas.getContext('2d'),gradient=context.createRadialGradient(32,32,2,32,32,32);gradient.addColorStop(0,inner);gradient.addColorStop(.5,inner);gradient.addColorStop(1,outer);context.fillStyle=gradient;context.fillRect(0,0,64,64);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;}
export class World {
  constructor(scene,seed) {
    this.grid=new Grid(seed);this.root=new THREE.Group();scene.add(this.root);this.tiles=[];this.batchRoot=new THREE.Group();this.root.add(this.batchRoot);this.batchDirty=true;
    this.ghosts=new Map();this.ghostMaterials=new Map();this.hiddenTiles=new Set();this.hiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);this.fadeX=Infinity;this.fadeZ=Infinity;
    const width=this.grid.half*2;
    part(this.root,'box',0xadc4b1,0,-.62,0,width+1.3,1.2,width+1.3);
    part(this.root,'box',CONFIG.colors.road,0,-.05,0,width,.1,width);
    for(let i=0;i<this.grid.tiles.length;i++)this.rebuild(i);
    this.owned=[];this.groundFxGeometry=new THREE.PlaneGeometry(2,2);this.shadowTexture=radialTexture('rgba(32,48,43,.82)','rgba(32,48,43,0)');this.glowTexture=radialTexture('rgba(255,255,255,.8)','rgba(255,255,255,0)');this.shadowMaterial=new THREE.MeshBasicMaterial({map:this.shadowTexture,color:0x42564f,transparent:true,opacity:.36,depthWrite:false});this.glowMaterial=new THREE.MeshBasicMaterial({map:this.glowTexture,color:0x8dffc1,transparent:true,opacity:.26,depthWrite:false,blending:THREE.AdditiveBlending});this.structureShadows=new THREE.InstancedMesh(this.groundFxGeometry,this.shadowMaterial,this.grid.tiles.length);this.vehicleShadows=new THREE.InstancedMesh(this.groundFxGeometry,this.shadowMaterial,CONFIG.director.maxEnemies+1);this.structureShadows.frustumCulled=this.vehicleShadows.frustumCulled=false;this.structureShadows.renderOrder=this.vehicleShadows.renderOrder=1;this.root.add(this.structureShadows,this.vehicleShadows);this.playerLight=new THREE.Mesh(this.groundFxGeometry,this.glowMaterial);this.playerLight.rotation.x=-Math.PI/2;this.playerLight.position.y=.095;this.playerLight.visible=false;this.playerLight.renderOrder=1;this.root.add(this.playerLight);this.groundFxDummy=new THREE.Object3D();this.owned.push(this.groundFxGeometry,this.shadowMaterial,this.glowMaterial,this.shadowTexture,this.glowTexture);
  }
  rebuild(i){this.removeGhost(i);if(this.tiles[i])this.tiles[i].removeFromParent();const mesh=tileModel(this.grid.tiles[i],i),p=this.grid.center(i);mesh.position.set(p.x,0,p.z);mesh.visible=false;mesh.traverse(part=>{if(part.isMesh)part.userData.tileIndex=i;});this.root.add(mesh);this.tiles[i]=mesh;this.batchDirty=true;}
  rebatch(){
    for(const mesh of this.batchRoot.children)mesh.dispose();this.batchRoot.clear();
    const groups=new Map();this.root.updateMatrixWorld(true);
    for(const tile of this.tiles)tile.traverse(mesh=>{if(!mesh.isMesh)return;const key=mesh.geometry.uuid+mesh.material.uuid;if(!groups.has(key))groups.set(key,{geometry:mesh.geometry,material:mesh.material,items:[]});groups.get(key).items.push(mesh);});
    this.batches=[];for(const group of groups.values()){const mesh=new THREE.InstancedMesh(group.geometry,group.material,group.items.length);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;group.items.forEach((item,i)=>mesh.setMatrixAt(i,this.hiddenTiles.has(item.userData.tileIndex)?this.hiddenMatrix:item.matrixWorld));this.batchRoot.add(mesh);this.batches.push({mesh,items:group.items});}this.updateStructureShadows();this.batchDirty=false;
  }
  updateStructureShadows(){let count=0;const d=this.groundFxDummy;for(let i=0;i<this.grid.tiles.length;i++){const type=this.grid.tiles[i];let sx=0,sz=0,reach=0;if(type===TILE.BRICK||type===TILE.STEEL){sx=1.15;sz=.9;reach=.34;}else if(type===TILE.HOUSE){sx=1.25;sz=1.15;reach=.48;}else if(type===TILE.TREE){sx=1.05;sz=1.1;reach=.38;}else if(type===TILE.HIGHRISE){sx=1.45;sz=2.05;reach=.9;}else if(type===TILE.SHOP){sx=1.3;sz=1.12;reach=.46;}else if(type===TILE.BARREL){sx=.55;sz=.68;reach=.2;}else continue;const p=this.grid.center(i);d.position.set(p.x+reach,.155,p.z-reach);d.rotation.set(-Math.PI/2,0,-.32);d.scale.set(sx,sz,1);d.updateMatrix();this.structureShadows.setMatrixAt(count++,d.matrix);}this.structureShadows.count=count;this.structureShadows.instanceMatrix.needsUpdate=true;}
  updateGroundEffects(player,enemies,night){const d=this.groundFxDummy;let count=0;const place=e=>{d.position.set(e.x+.12,.095,e.z-.12);d.rotation.set(-Math.PI/2,0,-.2);const size=e.radius*1.45;d.scale.set(size,size*.72,1);d.updateMatrix();this.vehicleShadows.setMatrixAt(count++,d.matrix);};place(player);for(const e of enemies)if(!e.dead)place(e);this.vehicleShadows.count=count;this.vehicleShadows.instanceMatrix.needsUpdate=true;this.playerLight.visible=night;this.playerLight.position.x=player.x;this.playerLight.position.z=player.z;this.playerLight.scale.setScalar(4.4);}
  updateInstances(){this.root.updateMatrixWorld(true);for(const {mesh,items} of this.batches) {items.forEach((item,i)=>mesh.setMatrixAt(i,this.hiddenTiles.has(item.userData.tileIndex)?this.hiddenMatrix:item.matrixWorld));mesh.instanceMatrix.needsUpdate=true;}}
  ghostMaterial(base){let ghost=this.ghostMaterials.get(base.uuid);if(!ghost){ghost=base.clone();ghost.transparent=true;ghost.opacity=.18;ghost.depthWrite=false;ghost.side=THREE.DoubleSide;this.ghostMaterials.set(base.uuid,ghost);}return ghost;}
  showGhost(i){
    if(this.ghosts.has(i))return;
    const source=this.tiles[i],type=this.grid.tiles[i];let ghost;
    ghost=new THREE.Group();if(type===TILE.HIGHRISE){const height=3.8+(i%4)*.65;part(ghost,'box',0x8ca9ab,0,height/2+.12,0,1.86,height,1.82);part(ghost,'box',0x526d70,0,height+.2,0,1.35,.18,1.3);}
    else if(type===TILE.HOUSE){part(ghost,'box',0xa9bdae,0,.84,0,1.95,1.5,1.85);const roof=part(ghost,'cone',0x78a3a2,0,1.91,0,2.05,.8,2.05);roof.rotation.y=Math.PI/4;}
    else if(type===TILE.TREE){part(ghost,'cylinder',0x8d826d,0,.65,0,.27,1,.27);part(ghost,'ico',0x79a985,0,1.5,0,1.6,1.9,1.6);}
    else if(type===TILE.SHOP){part(ghost,'box',0xb9b9a8,0,.72,0,2.05,1.25,1.86);part(ghost,'box',0xca836f,0,1.13,1.02,2.18,.16,.56);}
    ghost.visible=true;ghost.traverse(part=>{if(part.isMesh){part.material=this.ghostMaterial(part.material);part.castShadow=false;part.receiveShadow=false;part.renderOrder=2;}});
    ghost.position.copy(source.position);this.root.add(ghost);this.ghosts.set(i,ghost);this.hiddenTiles.add(i);this.transformsDirty=true;
  }
  removeGhost(i){const ghost=this.ghosts.get(i);if(!ghost)return;ghost.removeFromParent();this.ghosts.delete(i);this.hiddenTiles.delete(i);this.transformsDirty=true;}
  damage(i,amount,game){const type=this.grid.tiles[i],p=this.grid.center(i);if(!this.grid.damage(i,amount))return false;this.rebuild(i);const large=type===TILE.HIGHRISE?2:type===TILE.HOUSE||type===TILE.SHOP?1.35:1;game.effects.explosion(p.x,p.z,large);game.effects.emit(p.x,.7,p.z,type===TILE.BARREL?0xffba67:type===TILE.TREE?0x77a46b:0xc58b70,Math.round(12*large),.9,1.45);if(type===TILE.BARREL)game.combat.explode(p.x,p.z,3.8,42,'neutral');return true;}
  fadeOccluders(player){
    // Keep each house and tree full height. Only its rendering changes: replace
    // nearby foreground instances with faint copies so the tank stays visible.
    const moved=Math.hypot(player.x-this.fadeX,player.z-this.fadeZ)>.35;if(moved||this.batchDirty){this.fadeX=player.x;this.fadeZ=player.z;const candidates=[];for(let i=0;i<this.tiles.length;i++){const type=this.grid.tiles[i];if(![TILE.HOUSE,TILE.TREE,TILE.HIGHRISE,TILE.SHOP].includes(type))continue;const p=this.grid.center(i),dx=p.x-player.x,dz=p.z-player.z,range=type===TILE.HIGHRISE?10:7,distance=dx+dz;if(distance>0&&distance<range&&Math.abs(dx-dz)<4)candidates.push({i,distance});}
    candidates.sort((a,b)=>a.distance-b.distance);const visible=new Set(candidates.slice(0,7).map(c=>c.i));for(const i of visible)this.showGhost(i);for(const i of [...this.ghosts.keys()])if(!visible.has(i))this.removeGhost(i);}
    if(this.batchDirty)this.rebatch();else if(this.transformsDirty)this.updateInstances();this.transformsDirty=false;
  }
  dispose(){this.root.removeFromParent();for(const mesh of this.batchRoot.children)mesh.dispose();for(const ghost of this.ghosts.values())ghost.removeFromParent();this.ghosts.clear();this.hiddenTiles.clear();for(const mat of this.ghostMaterials.values())mat.dispose();this.ghostMaterials.clear();this.owned.forEach(r=>r.dispose());}
}
