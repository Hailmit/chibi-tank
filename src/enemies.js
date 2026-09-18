import { CONFIG, ENEMIES } from './config.js';
import { dist, walkable, turn, clamp } from './core.js';
import { tankModel, ring, material } from './models.js';
export class Enemies {
  constructor(game){this.game=game;this.list=[];this.pending=[];this.spawnTimer=1.8;this.eliteTimer=CONFIG.director.eliteEvery;this.assaultTimer=CONFIG.director.assaultFirst;this.assaultRemaining=0;this.serial=0;this.dirty=false;}
  schedule(type){
    const g=this.game,grid=g.world.grid;
    const elitePresent=this.list.some(e=>!e.dead&&e.type==='elite')||this.pending.some(e=>e.type==='elite');
    // Keep one director slot for a scheduled elite even when regular enemies saturate the arena.
    const cap=CONFIG.director.maxEnemies-(type!=='elite'&&!elitePresent?1:0);
    if(this.list.length+this.pending.length>=cap)return false;
    // One flood-fill proves reachability for every spawn cell. Calling path()
    // for every candidate repeated the same BFS hundreds of times per spawn.
    const reachable=grid.flood(grid.at(g.player.x,g.player.z)),possible=[];
    for(let i=0;i<grid.tiles.length;i++)if(walkable(grid.tiles[i])&&reachable[i]){const p=grid.center(i),d=dist(p,g.player);if(d>CONFIG.director.safeRadius&&d<25&&grid.free(p.x,p.z,ENEMIES[type].radius)&&!this.list.some(e=>dist(e,p)<2)&&!this.pending.some(e=>dist(e,p)<2))possible.push(p);}
    if(!possible.length)return false;const p=possible[Math.floor(grid.random()*possible.length)],marker=ring(g.scene,0xe87870,1.3);marker.position.set(p.x,.09,p.z);this.pending.push({...p,type,remaining:CONFIG.director.spawnWarning,marker});return true;
  }
  spawn(p){const g=this.game,data=ENEMIES[p.type],factor=1+Math.min(.7,g.time/700),model=tankModel(data.color,p.type,data.scale),baseMaxHP=data.hp*factor,e={...data,type:p.type,x:p.x,z:p.z,baseMaxHP,hp:baseMaxHP,maxHP:baseMaxHP,zombie:false,angle:0,aim:0,model,dead:false,fire:1.2,path:[],pathVersion:-1,pathTimer:0,senseTimer:0,distance:Infinity,los:false,desired:0,charge:0,burst:0,burstTimer:0,id:this.serial++,smoke:0,flash:0,phase:0};this.setZombie(e,g.isNight);g.scene.add(model.root);model.root.position.set(e.x,0,e.z);this.list.push(e);}
  setZombie(e,night){if(e.zombie===night)return;const ratio=e.maxHP?e.hp/e.maxHP:1;e.zombie=night;e.maxHP=e.baseMaxHP*(night?2:1);e.hp=Math.max(1,e.maxHP*ratio);e.model.zombie.visible=night;e.model.halo.material=material(night?0x82d35f:e.color,true);}
  setNight(night){for(const e of this.list)if(!e.dead)this.setZombie(e,night);for(const p of this.pending)p.marker.material=material(night?0x82d35f:0xe87870,true);}
  pickType(time,level){const r=this.game.world.grid.random();if(time<12)return 'scout';if(time<30)return r<.72?'scout':'gunner';if(time<45)return r<.5?'scout':r<.86?'gunner':'heavy';return r<.45-level*.2?'scout':r<.8-level*.12?'gunner':r<.91?'heavy':'mortar';}
  update(dt){
    const g=this.game,grid=g.world.grid,p=g.player,level=clamp(g.time/240,0,1);
    this.spawnTimer-=dt;this.eliteTimer-=dt;this.assaultTimer-=dt;
    if(this.eliteTimer<=0&&!this.list.some(e=>e.type==='elite')&&!this.pending.some(e=>e.type==='elite')){if(this.schedule('elite')){this.eliteTimer=CONFIG.director.eliteEvery;g.ui.toast('ĐẠI ÚY KẸO THÉP đang tiến vào thành phố');g.audio.play('warning');}}
    if(this.assaultTimer<=0&&this.assaultRemaining===0){this.assaultRemaining=3+Math.min(1,Math.floor(g.time/120))+(g.isNight?1:0);this.assaultTimer=Math.max(CONFIG.director.assaultMin,CONFIG.director.assaultBase-g.time*.01);g.ui.toast(g.isNight?'BẦY ZOMBIE ĐANG TRÀN TỚI!':'BÁO ĐỘNG · ĐỢT TẤN CÔNG DỒN DẬP');g.audio.play('warning');}
    if(this.spawnTimer<=0){const assault=this.assaultRemaining>0,scheduled=this.schedule(this.pickType(g.time,level));if(assault&&scheduled)this.assaultRemaining--;const onboarding=g.time<30?(30-g.time)/15:0;this.spawnTimer=assault?CONFIG.director.assaultGap:Math.max(CONFIG.director.spawnMin,CONFIG.director.spawnStart+onboarding-g.time*.008);}
    for(let i=this.pending.length-1;i>=0;i--){const s=this.pending[i];s.remaining-=dt;if(s.remaining<=0){s.marker.removeFromParent();this.pending.splice(i,1);if(dist(s,p)>=CONFIG.director.safeRadius&&grid.free(s.x,s.z,ENEMIES[s.type].radius)&&grid.path(grid.at(s.x,s.z),grid.at(p.x,p.z)).length)this.spawn(s);}}
    for(const e of this.list){
      if(e.dead)continue;e.fire-=dt;e.pathTimer-=dt;e.senseTimer-=dt;e.flash=Math.max(0,e.flash-dt);e.smoke-=dt;
      if(e.senseTimer<=0){const dx=p.x-e.x,dz=p.z-e.z;e.distance=Math.hypot(dx,dz);e.los=!grid.trace(e.x,e.z,p.x,p.z);e.desired=Math.atan2(dx,dz);e.senseTimer=.16+(e.id%4)*.03;}const distance=e.distance,los=e.los,desired=e.desired;
      if(e.charge<=0)e.aim=turn(e.aim,desired,1-Math.exp(-dt*5));
      if(e.charge>0){e.charge-=dt;if(e.charge<=0)this.attack(e);}
      else {
        let mx=0,mz=0;
        if(!los||distance>e.range){
          if(e.pathVersion!==grid.version||e.pathTimer<=0){e.path=grid.path(grid.at(e.x,e.z),grid.at(p.x,p.z));e.pathVersion=grid.version;e.pathTimer=1.05+(e.id%4)*.12;}
          if(e.path.length){const target=grid.center(e.path[0]);if(dist(e,target)<.22)e.path.shift();else{mx=target.x-e.x;mz=target.z-e.z;}}
        }else if(distance<e.range*.6){mx=e.x-p.x;mz=e.z-p.z;}
        else if(e.type==='scout'||level>.4){const sign=e.id%2?1:-1;mx=-(p.z-e.z)*sign;mz=(p.x-e.x)*sign;}
        const len=Math.hypot(mx,mz);if(len){mx/=len;mz/=len;const beforeX=e.x,beforeZ=e.z;grid.move(e,mx*e.speed*dt,mz*e.speed*dt);const blocked=this.list.some(other=>{if(other===e||other.dead)return false;const dx=e.x-other.x,dz=e.z-other.z,r=(e.radius+other.radius)*.86;return dx*dx+dz*dz<r*r;}),pdx=e.x-p.x,pdz=e.z-p.z,pr=e.radius+p.radius;if(blocked||pdx*pdx+pdz*pdz<pr*pr){e.x=beforeX;e.z=beforeZ;}e.angle=turn(e.angle,Math.atan2(mx,mz),1-Math.exp(-dt*8));}
        if(e.fire<=0&&distance<e.range+4&&los){e.charge=e.type==='heavy'?.95:e.type==='elite'?1.1:e.type==='mortar'?.65:.3;e.fire=e.interval/(1+level*.25);e.aim=desired;}
      }
      if(e.burst>0){e.burstTimer-=dt;if(e.burstTimer<=0){if(!grid.trace(e.x,e.z,p.x,p.z))g.combat.shoot(e,'enemy',e.damage);e.burst--;e.burstTimer=.18;}}
      e.model.root.position.set(e.x,0,e.z);e.model.body.rotation.y=e.angle;e.model.turret.rotation.y=e.aim;
      e.model.flashTime=Math.max(0,e.model.flashTime-dt);e.model.flash.visible=e.model.flashTime>0;e.model.halo.visible=e.charge>0||e.flash>0;if(e.model.halo.visible)e.model.halo.material=material(e.charge>0?0xffed9c:0xffffff,true);
      if(e.hp<e.maxHP*.3&&e.smoke<=0){e.smoke=.45;g.effects.emit(e.x,1,e.z,0x959588,1,.65);}
    }
    if(this.dirty){this.list=this.list.filter(e=>!e.dead);this.dirty=false;}
  }
  attack(e){const g=this.game;if(e.dead)return;
    if(e.type==='mortar'){g.combat.mortar(e,g.player.x,g.player.z);return;}
    if(e.type==='elite'){e.phase++;if(e.phase%2===0){for(let i=-1;i<=1;i++)g.combat.mortar(e,g.player.x+i*2.5,g.player.z+i*1.2);}else for(let i=-2;i<=2;i++)g.combat.shoot(e,'enemy',e.damage,i*.18);return;}
    if(g.world.grid.trace(e.x,e.z,g.player.x,g.player.z))return;
    g.combat.shoot(e,'enemy',e.damage);if(e.type==='gunner'){e.burst=2;e.burstTimer=.18;}
  }
  hurt(e,damage){if(e.dead)return;e.hp-=damage;e.flash=.12;const g=this.game;g.effects.emit(e.x,.8,e.z,0xffefb8,5,.23,1.2);if(e.hp<=0){e.dead=true;this.dirty=true;e.model.root.removeFromParent();g.effects.explosion(e.x,e.z,e.type==='elite'?2:1);g.audio.play('explosion');g.onKill(e);g.combat.drop(e.x,e.z);}}
  clear(){for(const e of this.list)e.model.root.removeFromParent();for(const p of this.pending)p.marker.removeFromParent();this.list=[];this.pending=[];this.dirty=false;}
}
