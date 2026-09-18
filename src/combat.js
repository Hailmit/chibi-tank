import * as THREE from 'three';
import { CONFIG } from './config.js';
import { TILE, dist, segmentCircle } from './core.js';
import { part, ring, material, pickupModel } from './models.js';
function playerRoundGeometry(){
  const positions=[],colors=[],color=new THREE.Color();
  for(const [tint,sx,sy,sz,y,z] of [[0x06354b,.3,.3,.86,0,0],[0x31eaff,.19,.075,.65,.15,0],[0xf4ffff,.12,.08,.16,.16,.32]]){
    const shape=new THREE.SphereGeometry(.5,10,6).toNonIndexed();shape.scale(sx,sy,sz);shape.translate(0,y,z);color.setHex(tint);
    const points=shape.getAttribute('position');for(let i=0;i<points.count;i++){positions.push(points.getX(i),points.getY(i),points.getZ(i));colors.push(color.r,color.g,color.b);}shape.dispose();
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();return geometry;
}
function specialRoundGeometry(kind){
  const positions=[],colors=[],color=new THREE.Color();
  const shapes=kind==='rocket'?
    [[new THREE.CylinderGeometry(.15,.17,.53,6),0xf36d38,Math.PI/2,0,0,0],[new THREE.ConeGeometry(.15,.27,6),0xfff1b1,Math.PI/2,0,0,.4],[new THREE.BoxGeometry(.35,.06,.16),0x6e4542,0,0,0,-.3],[new THREE.BoxGeometry(.06,.35,.16),0x6e4542,0,0,0,-.3]]:
    [[new THREE.OctahedronGeometry(.16,0),0xf5ad38,0,0,0,0],[new THREE.OctahedronGeometry(.085,0),0xffffff,0,0,0,.13]];
  for(const [shape,tint,rotation,x,y,z] of shapes){shape.rotateX(rotation);shape.translate(x,y,z);const flat=shape.index?shape.toNonIndexed():shape,points=flat.getAttribute('position');color.setHex(tint);for(let i=0;i<points.count;i++){positions.push(points.getX(i),points.getY(i),points.getZ(i));colors.push(color.r,color.g,color.b);}if(flat!==shape)flat.dispose();shape.dispose();}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();return geometry;
}
export class Combat {
  constructor(game){this.game=game;this.playerRoundGeometry=playerRoundGeometry();this.rocketGeometry=specialRoundGeometry('rocket');this.pelletGeometry=specialRoundGeometry('pellet');this.playerRoundMaterial=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});this.bullets=Array.from({length:CONFIG.combat.maxBullets},()=>{const mesh=part(game.scene,'sphere',0xf05b72,0,0,0,.17,.17,.65);mesh.visible=false;return {mesh,active:false};});this.enemyRoundGeometry=this.bullets[0].mesh.geometry;this.shells=Array.from({length:CONFIG.combat.maxMortars},()=>{const marker=ring(game.scene,0xef6867,2.6),mesh=part(game.scene,'sphere',0xf17963,0,0,0,.4);marker.visible=mesh.visible=false;return {marker,mesh,active:false};});this.activeBullets=new Set();this.activeShells=new Set();this.pickups=[];this.tip=new THREE.Vector3();}
  firePlayer(player){
    const type=player.weapon,weapon=CONFIG.weapons[type];
    if(!weapon)return this.shoot(player,'player',CONFIG.player.damage)?CONFIG.player.fireInterval:0;
    let fired=false;
    if(type==='rocket')fired=this.shoot(player,'player',weapon.damage,0,'rocket');
    else if(type==='shotgun'){for(const offset of [-.3,-.18,-.06,.06,.18,.3])fired=this.shoot(player,'player',weapon.damage,offset,'pellet',!fired,false)||fired;if(fired)this.game.effects.shotgunMuzzle(this.tip.x,this.tip.y,this.tip.z,player.aim);}
    else if(type==='flame')fired=this.flame(player,weapon);
    else if(type==='electric')fired=this.electric(player,weapon);
    if(!fired)return 0;
    player.ammo--;
    if(player.ammo<=0){player.weapon='normal';player.ammo=0;this.game.ui.toast('HẾT ĐẠN ĐẶC BIỆT · PHÁO THƯỜNG');}
    return weapon.interval;
  }
  flame(player,weapon){
    const g=this.game,grid=g.world.grid,range=6.5,angle=player.aim,hitWalls=new Set();let visualRange=range;
    for(const e of g.enemies.list){if(e.dead)continue;const distance=dist(player,e),bearing=Math.atan2(e.x-player.x,e.z-player.z),difference=Math.abs(Math.atan2(Math.sin(bearing-angle),Math.cos(bearing-angle)));if(distance>range||difference>.43||grid.trace(player.x,player.z,e.x,e.z))continue;g.enemies.hurt(e,weapon.damage,true);if(!e.dead){e.burn=Math.max(e.burn,1.5);e.burnTick=Math.min(e.burnTick||.45,.45);}}
    for(const offset of [-.34,0,.34]){const a=angle+offset,x=player.x+Math.sin(a)*range,z=player.z+Math.cos(a)*range,wall=grid.trace(player.x,player.z,x,z,.1);if(wall){visualRange=Math.min(visualRange,range*wall.t);if(!hitWalls.has(wall.i)){hitWalls.add(wall.i);g.world.damage(wall.i,weapon.damage,g);}}}
    g.effects.flameJet(player.x,player.z,angle,visualRange);
    player.model.flashTime=.08;g.audio.play('flame');return true;
  }
  electric(player,weapon){
    const g=this.game,grid=g.world.grid,used=new Set();let source=player,hit=0;
    for(let jump=0;jump<4;jump++){
      let best=null,bestDistance=Infinity;
      for(const e of g.enemies.list){if(e.dead||used.has(e))continue;const distance=dist(source,e);if(distance>(jump===0?11:5.2)||distance>=bestDistance||grid.trace(source.x,source.z,e.x,e.z))continue;if(jump===0){const bearing=Math.atan2(e.x-player.x,e.z-player.z),difference=Math.abs(Math.atan2(Math.sin(bearing-player.aim),Math.cos(bearing-player.aim)));if(difference>.5)continue;}best=e;bestDistance=distance;}
      if(!best)break;used.add(best);g.effects.arc(source.x,source.z,best.x,best.z);g.effects.electricBurst(best.x,best.z);g.enemies.hurt(best,Math.round(weapon.damage*(1-jump*.18)),true);if(!best.dead)best.stun=Math.max(best.stun,.35);source=best;hit++;
    }
    if(!hit){const x=player.x+Math.sin(player.aim)*11,z=player.z+Math.cos(player.aim)*11,wall=grid.trace(player.x,player.z,x,z,.1),end=wall?{x:player.x+(x-player.x)*wall.t,z:player.z+(z-player.z)*wall.t}:{x,z};g.effects.arc(player.x,player.z,end.x,end.z);g.effects.electricBurst(end.x,end.z);if(wall)g.world.damage(wall.i,weapon.damage*.6,g);}
    player.model.flashTime=.1;g.audio.play('electric');return true;
  }
  shoot(owner,team,damage,offset=0,kind='normal',sound=true,muzzleEffect=true){
    const b=this.bullets.find(b=>!b.active);if(!b)return false;
    const g=this.game,m=owner.model;m.root.position.set(owner.x,0,owner.z);m.turret.rotation.y=owner.aim;m.root.updateMatrixWorld(true);m.tip.getWorldPosition(this.tip);
    const angle=owner.aim+offset,speed=kind==='rocket'?17:kind==='pellet'?29:team==='player'?CONFIG.combat.bulletSpeed:CONFIG.combat.enemyBulletSpeed*(1+Math.min(.45,g.time/700));
    // Check the breech-to-muzzle segment too: a muzzle can overlap a wall while the hull cannot.
    const obstruction=g.world.grid.trace(owner.x,owner.z,this.tip.x,this.tip.z,.1);
    const playSound=()=>{if(sound)g.audio.play(team!=='player'?'enemyShot':kind==='rocket'?'rocket':kind==='pellet'?'shotgun':'shot',team==='player'?0:dist(owner,g.player));};
    if(obstruction){if(kind==='rocket')this.explode(this.tip.x,this.tip.z,2.8,damage,'player','rocket');else g.world.damage(obstruction.i,damage,g);m.flashTime=.1;if(muzzleEffect)g.effects.emit(this.tip.x,.8,this.tip.z,team==='player'?0x59efff:0xffd790,6,.22,1.25);playSound();return true;}
    Object.assign(b,{active:true,x:this.tip.x,y:this.tip.y,z:this.tip.z,vx:Math.sin(angle)*speed,vz:Math.cos(angle)*speed,team,damage,kind,angle,trail:0,life:kind==='pellet'?.46:kind==='rocket'?2.5:3.5});this.activeBullets.add(b);b.mesh.position.set(b.x,b.y,b.z);b.mesh.rotation.y=angle;b.mesh.geometry=kind==='rocket'?this.rocketGeometry:kind==='pellet'?this.pelletGeometry:team==='player'?this.playerRoundGeometry:this.enemyRoundGeometry;
    if(kind==='rocket')b.mesh.scale.setScalar(1.2);else if(kind==='pellet')b.mesh.scale.setScalar(1.35);else b.mesh.scale.set(team==='player'?1:.17,team==='player'?1:.17,team==='player'?1:.65);
    b.mesh.material=team==='player'||kind==='rocket'||kind==='pellet'?this.playerRoundMaterial:material(0xf05b72,true);b.mesh.visible=true;
    m.flashTime=.1;if(muzzleEffect)g.effects.emit(b.x,.9,b.z,kind==='rocket'?0xffad68:team==='player'?0x63f1ff:0xffd19b,6,.18,1.3);playSound();return true;
  }
  mortar(owner,x,z){const s=this.shells.find(s=>!s.active);if(!s)return;Object.assign(s,{active:true,x,z,startX:owner.x,startZ:owner.z,life:1.65,max:1.65,damage:owner.damage});this.activeShells.add(s);s.marker.visible=s.mesh.visible=true;s.marker.position.set(x,.12,z);s.marker.scale.setScalar(2.6);this.game.audio.play('warning');}
  explode(x,z,radius,damage,team,visual='normal'){
    const g=this.game;if(visual==='rocket')g.effects.rocketExplosion(x,z,radius/3);else g.effects.explosion(x,z,radius/3);g.audio.play('explosion');
    if(team!=='player'&&dist({x,z},g.player)<radius+g.player.radius&&!g.world.grid.trace(x,z,g.player.x,g.player.z))g.player.hurt(damage,g);
    if(team!=='enemy')for(const e of g.enemies.list)if(!e.dead&&dist({x,z},e)<radius+e.radius&&!g.world.grid.trace(x,z,e.x,e.z))g.enemies.hurt(e,damage);
    // Destroy first, recurse second through World.damage: exploded barrels cannot retrigger themselves.
    const targets=[];for(let i=0;i<g.world.grid.tiles.length;i++)if(Number.isFinite(g.world.grid.hp[i])&&dist({x,z},g.world.grid.center(i))<radius)targets.push(i);
    for(const i of targets)g.world.damage(i,damage,g);
  }
  update(dt){const g=this.game,grid=g.world.grid;
    for(const b of this.activeBullets){const nx=b.x+b.vx*dt,nz=b.z+b.vz*dt,wall=grid.trace(b.x,b.z,nx,nz,.1);let best=wall?wall.t:Infinity,target=null;
      for(const e of b.team==='player'?g.enemies.list:[g.player]){if(e.dead||e.hp<=0)continue;const t=segmentCircle(b.x,b.z,nx,nz,e.x,e.z,e.radius+.11);if(t!==null&&t<best){best=t;target=e;}}
      if(best!==Infinity){const x=b.x+(nx-b.x)*best,z=b.z+(nz-b.z)*best;if(b.kind==='rocket')this.explode(x,z,2.8,b.damage,'player','rocket');else{g.effects.emit(x,.7,z,b.kind==='pellet'?0xffc45e:b.team==='player'?0x72f2ff:0xffcc9e,b.kind==='pellet'?4:7,.3,1.3);if(target){if(b.team==='player')g.enemies.hurt(target,b.damage);else target.hurt(b.damage,g);}else{g.effects.emit(x,.3,z,0xc9bdac,5,.5,1.5);g.world.damage(wall.i,b.damage,g);}}b.active=false;}
      b.x=nx;b.z=nz;b.life-=dt;if(b.life<=0||Math.abs(nx)>grid.half||Math.abs(nz)>grid.half)b.active=false;if(b.active&&b.kind==='rocket'){b.trail-=dt;if(b.trail<=0){b.trail=.09;g.effects.rocketTrail(nx,b.y,nz,b.angle);}}b.mesh.visible=b.active;b.mesh.position.set(nx,b.y,nz);if(!b.active)this.activeBullets.delete(b);
    }
    for(const s of this.activeShells){s.life-=dt;const t=1-s.life/s.max;s.mesh.position.set(s.startX+(s.x-s.startX)*t,1+Math.sin(t*Math.PI)*8,s.startZ+(s.z-s.startZ)*t);if(s.life<=0){s.active=false;this.activeShells.delete(s);s.mesh.visible=s.marker.visible=false;this.explode(s.x,s.z,2.6,s.damage,'enemy');}}
    for(let i=this.pickups.length-1;i>=0;i--){const p=this.pickups[i];p.life-=dt;if(dist(p,g.player)<1.2){const player=g.player,names=['+30 GIÁP','ĐẦY NĂNG LƯỢNG','TĂNG TỐC · 8s','BẮN NHANH · 8s'];if(p.type===0)player.hp=Math.min(CONFIG.player.hp,player.hp+30);if(p.type===1)player.stamina=CONFIG.player.stamina;if(p.type===2)player.speedBuff=8;if(p.type===3)player.fireBuff=8;if(p.type>=4){const type=['rocket','shotgun','flame','electric'][p.type-4];player.equipWeapon(type);names[p.type]=`${CONFIG.weapons[type].name} ×${player.ammo}`;g.ui.toast(`NHẶT ${CONFIG.weapons[type].name} · ${player.ammo} ĐẠN`);}g.audio.play('pickup');g.effects.emit(p.x,1,p.z,p.type>=4?CONFIG.weapons[player.weapon].color:0xb6ffce,7,.55);g.effects.popup(p.x,p.z,names[p.type],p.type>=4?'#fff0bf':'#a9ffe2');p.life=0;}if(p.life<=0){p.mesh.removeFromParent();this.pickups.splice(i,1);}}
  }
  spawnPickup(type,x,z){const g=this.game;if(this.pickups.length>=CONFIG.combat.maxPickups)return null;const mesh=pickupModel(type);mesh.position.set(x,.8,z);g.scene.add(mesh);const pickup={x,z,type,mesh,life:18};this.pickups.push(pickup);return pickup;}
  drop(x,z){const grid=this.game.world.grid;if(this.pickups.length>=CONFIG.combat.maxPickups||grid.random()>.65)return;const roll=grid.random(),type=roll<.4?4+Math.min(3,Math.floor(roll/.4*4)):Math.min(3,Math.floor((roll-.4)/.6*4));this.spawnPickup(type,x,z);}
  clear(){for(const b of this.activeBullets){b.active=false;b.mesh.visible=false;}for(const s of this.activeShells){s.active=false;s.mesh.visible=s.marker.visible=false;}this.activeBullets.clear();this.activeShells.clear();for(const p of this.pickups)p.mesh.removeFromParent();this.pickups=[];}
}
