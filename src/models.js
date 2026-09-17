import * as THREE from 'three';
import { CONFIG } from './config.js';
import { TILE } from './core.js';
const geometries = {
  box: new THREE.BoxGeometry(1,1,1), sphere: new THREE.SphereGeometry(.5,12,8),
  cylinder: new THREE.CylinderGeometry(.5,.5,1,12), cone: new THREE.ConeGeometry(.7,1,4),
  ring: new THREE.RingGeometry(.83,1,48), ico: new THREE.IcosahedronGeometry(.5,0),
};
const materials=new Map();
const mergedGeometries=new Map();
const mergedMaterial=new THREE.MeshLambertMaterial({vertexColors:true});
export function material(color,unlit=false) { const key=`${color}-${unlit}`;if(!materials.has(key))materials.set(key,unlit?new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}):new THREE.MeshLambertMaterial({color}));return materials.get(key); }
export function part(parent,type,color,x,y,z,sx=1,sy=sx,sz=sx) {
  const mesh=new THREE.Mesh(geometries[type],material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function ring(parent,color,radius=1) { const m=new THREE.Mesh(geometries.ring,material(color,true));m.rotation.x=-Math.PI/2;m.position.y=.08;m.scale.setScalar(radius);parent.add(m);return m; }
function mergedPart(parent,key,specs){
  let geometry=mergedGeometries.get(key);
  if(!geometry){
    const positions=[],normals=[],colors=[],matrix=new THREE.Matrix4(),quaternion=new THREE.Quaternion(),position=new THREE.Vector3(),scale=new THREE.Vector3(),euler=new THREE.Euler(),color=new THREE.Color();
    for(const [type,tint,x,y,z,sx=1,sy=sx,sz=sx,rx=0,ry=0,rz=0] of specs){
      const source=geometries[type].index?geometries[type].toNonIndexed():geometries[type].clone();
      position.set(x,y,z);scale.set(sx,sy,sz);quaternion.setFromEuler(euler.set(rx,ry,rz));matrix.compose(position,quaternion,scale);source.applyMatrix4(matrix);
      const p=source.getAttribute('position'),n=source.getAttribute('normal');color.setHex(tint);
      for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(color.r,color.g,color.b);}
      source.dispose();
    }
    geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();mergedGeometries.set(key,geometry);
  }
  const mesh=new THREE.Mesh(geometry,mergedMaterial);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function compactEnemyTank(color,kind,scale){
  const root=new THREE.Group(),body=new THREE.Group(),turret=new THREE.Group(),zombie=new THREE.Group(),dark=CONFIG.colors.ink;root.add(body,turret,zombie);
  const bodyParts=[['box',dark,-.53,.3,0,.35,.5,1.35],['box',dark,.53,.3,0,.35,.5,1.35],['box',0x425c59,-.53,.55,0,.38,.06,1.18],['box',0x425c59,.53,.55,0,.38,.06,1.18],['box',color,0,.55,0,1.05,.48,1.1],['box',0xe8edcc,0,.59,.56,.72,.1,.05],['sphere',0xffe9ac,-.35,.52,.58,.15],['sphere',0xffe9ac,.35,.52,.58,.15]];
  if(kind==='heavy'||kind==='elite')bodyParts.push(['box',color,-.5,.7,0,.28,.55,1.45],['box',color,.5,.7,0,.28,.55,1.45]);
  mergedPart(body,`enemy-body-${kind}-${color}`,bodyParts);
  const turretParts=[['sphere',color,0,.93,0,.95,.76,.85],['cylinder',dark,0,1.26,-.09,.35,.09,.35],['cylinder',color,0,.96,.7,.23,.85,.23,Math.PI/2,0,0],['box',dark,0,.96,1.16,.28,.28,.12]];
  if(kind==='gunner')turretParts.push(['box',dark,.36,1.04,.2,.18,.2,.8]);
  if(kind==='mortar')turretParts.push(['cylinder',dark,0,1.42,0,.55,.85,.55,.35,0,0]);
  if(kind==='elite')for(const x of [-.3,0,.3])turretParts.push(['cone',0xffd36c,x,1.48,0,.25,.4,.25]);
  mergedPart(turret,`enemy-turret-${kind}-${color}`,turretParts);
  const barrel=new THREE.Group();barrel.position.set(0,.96,.22);turret.add(barrel);
  const tip=new THREE.Object3D();tip.position.set(0,0,1.02);barrel.add(tip);const flash=part(barrel,'ico',0xffe9a2,0,0,1.12,.5);flash.material=material(0xffedb4,true);flash.visible=false;
  mergedPart(zombie,`enemy-zombie`,[['box',0x547c4b,0,1.1,.61,.72,.16,.18,-.18,0,0],['sphere',0xa8ff62,-.25,1.08,.72,.13],['sphere',0xa8ff62,.25,1.08,.72,.13],['cone',0x6b934f,-.48,.98,-.42,.19,.42,.19,Math.PI,0,0],['cone',0x6b934f,0,.98,-.42,.19,.42,.19,Math.PI,0,0],['cone',0x6b934f,.48,.98,-.42,.19,.42,.19,Math.PI,0,0]]);zombie.visible=false;
  const halo=ring(root,color,kind==='elite'?1.1:.84);halo.visible=false;root.scale.setScalar(scale);return {root,body,turret,zombie,barrel,tip,flash,halo,flashTime:0};
}
function compactPlayerTank(color,scale){
  const root=new THREE.Group(),body=new THREE.Group(),turret=new THREE.Group(),zombie=new THREE.Group(),dark=CONFIG.colors.ink;root.add(body,turret,zombie);
  const bodyParts=[];for(const x of [-.53,.53]){bodyParts.push(['box',dark,x,.3,0,.35,.5,1.35]);for(const z of [-.43,0,.43])bodyParts.push(['cylinder',0x78918c,x,.28,z,.28,.38,.28,0,0,Math.PI/2]);for(let z=-.55;z<=.56;z+=.22)bodyParts.push(['box',0x425c59,x,.55,z,.38,.035,.08]);}
  bodyParts.push(['box',color,0,.55,0,1.05,.48,1.1],['box',0xe8edcc,0,.59,.56,.72,.1,.05],['sphere',0xffe9ac,-.35,.52,.58,.15],['sphere',0xffe9ac,.35,.52,.58,.15],['cylinder',dark,-.4,1.15,-.4,.035,1,.035,0,0,-.14],['sphere',0xffd36c,-.47,1.65,-.4,.14]);mergedPart(body,`player-body-${color}`,bodyParts);
  mergedPart(turret,`player-turret-${color}`,[['sphere',color,0,.93,0,.95,.76,.85],['cylinder',dark,0,1.26,-.09,.35,.09,.35],['box',0xf5f2d8,0,1.31,.08,.1,.03,.34],['box',0xf5f2d8,0,1.31,.08,.34,.03,.1],['cylinder',color,0,.96,.7,.23,.85,.23,Math.PI/2,0,0],['box',dark,0,.96,1.16,.28,.28,.12]]);
  const barrel=new THREE.Group();barrel.position.set(0,.96,.22);turret.add(barrel);
  const tip=new THREE.Object3D();tip.position.set(0,0,1.02);barrel.add(tip);const flash=part(barrel,'ico',0xffe9a2,0,0,1.12,.5);flash.material=material(0xffedb4,true);flash.visible=false;zombie.visible=false;const halo=ring(root,0xf9ffe3,.84);root.scale.setScalar(scale);return {root,body,turret,zombie,barrel,tip,flash,halo,flashTime:0};
}
export function tankModel(color,kind='player',scale=1) {
  return kind==='player'?compactPlayerTank(color,scale):compactEnemyTank(color,kind,scale);
}
export function tileModel(type,index) {
  const g=new THREE.Group(),c=CONFIG.colors,s=CONFIG.world.cell;
  if(type===TILE.ROAD)return g;
  if(type===TILE.GRASS)return g;
  if(type===TILE.RUBBLE){
    part(g,'box',0xa8aa9d,0,.04,0,2.28,.08,2.28);
    for(let n=0;n<3;n++){const rock=part(g,n%2?'box':'ico',[0x927f70,0xc58f72,0x6f8583][(index+n)%3],((index*7+n*5)%17-8)/10,.17,((index*3+n*7)%17-8)/10,.3,.18,.25);rock.rotation.y=(index+n)*.7;}
    return g;
  }
  part(g,'box',0xd6d8c8,0,.07,0,s-.06,.14,s-.06);
  if(type===TILE.BRICK){
    part(g,'box',0xd88366,0,.62,0,2.18,1.05,1.85);for(const y of [.35,.72,1.08])part(g,'box',0xf2bd8a,0,y,.93,2.2,.05,.04);
  }
  if(type===TILE.STEEL){part(g,'box',c.steel,0,.63,0,2.16,1.1,2.16);part(g,'box',0xbdd5d9,0,1.21,0,2.2,.14,2.2);}
  if(type===TILE.HOUSE){
    const color=[0xf3d2a1,0xa3cfd0,0xefd7b5,0xb8cbb3][index%4];
    part(g,'box',color,0,.84,0,1.95,1.5,1.85);
    const roof=part(g,'cone',index%2?0xd88a70:0x659caa,0,1.91,0,2.05,.8,2.05);roof.rotation.y=Math.PI/4;
    part(g,'box',0x577e88,-.45,1.04,.95,.42,.46,.04);part(g,'box',0x627f7e,.52,.65,.96,.45,.78,.05);
  }
  if(type===TILE.TREE){part(g,'box',c.grass,0,.12,0,2.3,.1,2.3);part(g,'cylinder',0x9c8564,0,.65,0,.3,1,.3);part(g,'ico',0x71ad83,0,1.5,0,1.75,2,1.75);}
  if(type===TILE.HIGHRISE){
    const height=3.8+(index%4)*.65,color=[0x8ca9ab,0xb7ae9b,0x7798a2][index%3];part(g,'box',color,0,height/2+.12,0,1.86,height,1.82);
    part(g,'box',0x526d70,0,height+.2,0,1.35,.18,1.3);part(g,'box',0xb8e1df,0,height*.52+.1,.925,1.35,height*.72,.035);part(g,'box',0x6e9298,.925,height*.52+.1,0,.035,height*.72,1.3);
  }
  if(type===TILE.SHOP){
    const wall=[0xe1b18d,0xa7c9bd,0xe6cf91][index%3],awning=[0xd9675e,0x5b9fac,0xe6a449][index%3];part(g,'box',wall,0,.72,0,2.05,1.25,1.86);part(g,'box',0x746b62,0,1.39,0,2.12,.14,1.95);
    part(g,'box',awning,0,1.13,1.02,2.18,.16,.56);part(g,'box',0x52767a,-.5,.67,.98,.55,.56,.04);part(g,'box',0x63584f,.52,.52,.96,.55,.9,.06);part(g,'box',0xffe7a6,0,1.58,.93,1.05,.3,.08);
  }
  if(type===TILE.BARREL){part(g,'cylinder',c.coral,0,.62,0,.94,1.1,.94);for(const y of [.28,.93])part(g,'cylinder',0x805b53,0,y,0,.98,.08,.98);part(g,'box',c.yellow,0,.62,.475,.34,.38,.025);}
  return g;
}
export function disposeShared() { Object.values(geometries).forEach(g=>g.dispose());materials.forEach(m=>m.dispose());mergedGeometries.forEach(g=>g.dispose());mergedMaterial.dispose(); }
