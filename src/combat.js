import * as THREE from 'three';
import { CONFIG } from './config.js';
import { TILE, dist, segmentCircle } from './core.js';
import { part, ring, material } from './models.js';
export class Combat {
  constructor(game){this.game=game;this.bullets=Array.from({length:CONFIG.combat.maxBullets},()=>{const mesh=part(game.scene,'sphere',0xffd36c,0,0,0,.17,.17,.65);mesh.visible=false;return {mesh,active:false};});this.shells=Array.from({length:CONFIG.combat.maxMortars},()=>{const marker=ring(game.scene,0xef6867,2.6),mesh=part(game.scene,'sphere',0xf17963,0,0,0,.4);marker.visible=mesh.visible=false;return {marker,mesh,active:false};});this.activeBullets=new Set();this.activeShells=new Set();this.pickups=[];this.tip=new THREE.Vector3();}
  shoot(owner,team,damage,offset=0){
    const b=this.bullets.find(b=>!b.active);if(!b)return false;
    const g=this.game,m=owner.model;m.root.position.set(owner.x,0,owner.z);m.turret.rotation.y=owner.aim;m.root.updateMatrixWorld(true);m.tip.getWorldPosition(this.tip);
    const angle=owner.aim+offset,speed=team==='player'?CONFIG.combat.bulletSpeed:CONFIG.combat.enemyBulletSpeed*(1+Math.min(.45,g.time/700));
    // Check the breech-to-muzzle segment too: a muzzle can overlap a wall while the hull cannot.
    const obstruction=g.world.grid.trace(owner.x,owner.z,this.tip.x,this.tip.z,.1);
    if(obstruction){g.world.damage(obstruction.i,damage,g);m.flashTime=.065;g.effects.emit(this.tip.x,.8,this.tip.z,0xffd790,3,.2);if(team==='player')g.audio.play('shot');return true;}
    Object.assign(b,{active:true,x:this.tip.x,y:this.tip.y,z:this.tip.z,vx:Math.sin(angle)*speed,vz:Math.cos(angle)*speed,team,damage,life:3.5});this.activeBullets.add(b);b.mesh.position.set(b.x,b.y,b.z);b.mesh.rotation.y=angle;b.mesh.material=material(team==='player'?0xffcf65:0xf05b72,true);b.mesh.visible=true;
    m.flashTime=.065;g.effects.emit(b.x,.9,b.z,0xffe5a0,3,.12);if(team==='player')g.audio.play('shot');return true;
  }
  mortar(owner,x,z){const s=this.shells.find(s=>!s.active);if(!s)return;Object.assign(s,{active:true,x,z,startX:owner.x,startZ:owner.z,life:1.65,max:1.65,damage:owner.damage});this.activeShells.add(s);s.marker.visible=s.mesh.visible=true;s.marker.position.set(x,.12,z);s.marker.scale.setScalar(2.6);this.game.audio.play('warning');}
  explode(x,z,radius,damage,team){
    const g=this.game;g.effects.explosion(x,z,radius/3);g.audio.play('explosion');
    if(team!=='player'&&dist({x,z},g.player)<radius+g.player.radius&&!g.world.grid.trace(x,z,g.player.x,g.player.z))g.player.hurt(damage,g);
    if(team!=='enemy')for(const e of g.enemies.list)if(!e.dead&&dist({x,z},e)<radius+e.radius&&!g.world.grid.trace(x,z,e.x,e.z))g.enemies.hurt(e,damage);
    // Destroy first, recurse second through World.damage: exploded barrels cannot retrigger themselves.
    const targets=[];for(let i=0;i<g.world.grid.tiles.length;i++)if(Number.isFinite(g.world.grid.hp[i])&&dist({x,z},g.world.grid.center(i))<radius)targets.push(i);
    for(const i of targets)g.world.damage(i,damage,g);
  }
  update(dt){const g=this.game,grid=g.world.grid;
    for(const b of this.activeBullets){const nx=b.x+b.vx*dt,nz=b.z+b.vz*dt,wall=grid.trace(b.x,b.z,nx,nz,.1);let best=wall?wall.t:Infinity,target=null;
      for(const e of b.team==='player'?g.enemies.list:[g.player]){if(e.dead||e.hp<=0)continue;const t=segmentCircle(b.x,b.z,nx,nz,e.x,e.z,e.radius+.11);if(t!==null&&t<best){best=t;target=e;}}
      if(best!==Infinity){const x=b.x+(nx-b.x)*best,z=b.z+(nz-b.z)*best;g.effects.emit(x,.7,z,0xffdc9e,5,.35);if(target){if(b.team==='player')g.enemies.hurt(target,b.damage);else target.hurt(b.damage,g);}else g.world.damage(wall.i,b.damage,g);b.active=false;}
      b.x=nx;b.z=nz;b.life-=dt;if(b.life<=0||Math.abs(nx)>grid.half||Math.abs(nz)>grid.half)b.active=false;b.mesh.visible=b.active;b.mesh.position.set(nx,b.y,nz);if(!b.active)this.activeBullets.delete(b);
    }
    for(const s of this.activeShells){s.life-=dt;const t=1-s.life/s.max;s.mesh.position.set(s.startX+(s.x-s.startX)*t,1+Math.sin(t*Math.PI)*8,s.startZ+(s.z-s.startZ)*t);if(s.life<=0){s.active=false;this.activeShells.delete(s);s.mesh.visible=s.marker.visible=false;this.explode(s.x,s.z,2.6,s.damage,'enemy');}}
    for(let i=this.pickups.length-1;i>=0;i--){const p=this.pickups[i];p.life-=dt;if(dist(p,g.player)<1.2){const player=g.player;if(p.type===0)player.hp=Math.min(CONFIG.player.hp,player.hp+30);if(p.type===1)player.stamina=CONFIG.player.stamina;if(p.type===2)player.speedBuff=8;if(p.type===3)player.fireBuff=8;g.audio.play('pickup');g.effects.emit(p.x,1,p.z,0xb6ffce,7,.55);g.effects.popup(p.x,p.z,['+30 GIÁP','ĐẦY NĂNG LƯỢNG','TĂNG TỐC · 8s','BẮN NHANH · 8s'][p.type],'#a9ffe2');p.life=0;}if(p.life<=0){p.mesh.removeFromParent();this.pickups.splice(i,1);}}
  }
  drop(x,z){const g=this.game;if(this.pickups.length>=CONFIG.combat.maxPickups||g.world.grid.random()>.4)return;const type=Math.floor(g.world.grid.random()*4),mesh=new THREE.Group();part(mesh,'box',[0x8fd6ac,0x89c7e6,0xffd36c,0xe69bd4][type],0,0,0,.6);part(mesh,'box',0xffffff,0,.32,0,.12,.03,.4);if(type<2)part(mesh,'box',0xffffff,0,.32,0,.4,.03,.12);mesh.position.set(x,.8,z);g.scene.add(mesh);this.pickups.push({x,z,type,mesh,life:18});}
  clear(){for(const b of this.activeBullets){b.active=false;b.mesh.visible=false;}for(const s of this.activeShells){s.active=false;s.mesh.visible=s.marker.visible=false;}this.activeBullets.clear();this.activeShells.clear();for(const p of this.pickups)p.mesh.removeFromParent();this.pickups=[];}
}
