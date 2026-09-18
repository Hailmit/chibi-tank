import { CONFIG } from './config.js';
import { turn } from './core.js';
import { tankModel } from './models.js';
export class Player {
  constructor(scene){Object.assign(this,{x:0,z:0,radius:CONFIG.player.radius,hp:CONFIG.player.hp,maxHP:CONFIG.player.hp,stamina:CONFIG.player.stamina,angle:Math.PI,aim:Math.PI,fire:0,dash:0,dashCooldown:0,invulnerable:0,regenDelay:0,speedBuff:0,fireBuff:0,trail:0,weapon:'normal',ammo:0,armorLevel:0,engineLevel:0,cannonLevel:0,speedMultiplier:1,staminaRegenMultiplier:1,damageMultiplier:1});this.model=tankModel(CONFIG.colors.mint);scene.add(this.model.root);}
  equipWeapon(type){const weapon=CONFIG.weapons[type];if(!weapon)return;this.ammo=this.weapon===type?Math.min(weapon.maxAmmo,this.ammo+weapon.ammo):weapon.ammo;this.weapon=type;this.fire=0;}
  update(dt,game){
    const c=CONFIG.player,i=game.input,m=i.movement();
    for(const key of ['fire','dashCooldown','invulnerable','regenDelay','speedBuff','fireBuff'])this[key]=Math.max(0,this[key]-dt);
    if(this.regenDelay===0)this.stamina=Math.min(c.stamina,this.stamina+c.staminaRegen*this.staminaRegenMultiplier*dt);
    if(i.dash){i.dash=false;if(this.stamina>=c.dashCost&&this.dashCooldown<=0){this.stamina-=c.dashCost;this.dash=c.dashDuration;this.invulnerable=c.dashInvulnerability;this.dashCooldown=c.dashCooldown;this.regenDelay=.5;this.dashX=m.x||m.z?m.x:Math.sin(this.angle);this.dashZ=m.x||m.z?m.z:Math.cos(this.angle);game.audio.play('dash');}}
    if(m.x||m.z)this.angle=turn(this.angle,Math.atan2(m.x,m.z),1-Math.exp(-dt*14));
    const dashing=this.dash>0,speed=c.speed*this.speedMultiplier*(this.speedBuff>0?1.4:1);
    game.world.grid.move(this,(dashing?this.dashX*c.dashSpeed:m.x*speed)*dt,(dashing?this.dashZ*c.dashSpeed:m.z*speed)*dt);
    this.dash=Math.max(0,this.dash-dt);
    const target=i.aim(game.camera,this);let aim=Math.atan2(target.x-this.x,target.z-this.z);
    if(i.touchCapable&&i.firing){let best=null,bestScore=Infinity;for(const enemy of game.enemies.list){if(enemy.dead)continue;const distance=Math.hypot(enemy.x-this.x,enemy.z-this.z),enemyAim=Math.atan2(enemy.x-this.x,enemy.z-this.z),difference=Math.abs(Math.atan2(Math.sin(enemyAim-aim),Math.cos(enemyAim-aim)));if(distance<=16&&difference<.26&&!game.world.grid.trace(this.x,this.z,enemy.x,enemy.z)){const score=difference*3+distance/24;if(score<bestScore){best=enemy;bestScore=score;}}}if(best)aim=Math.atan2(best.x-this.x,best.z-this.z);}
    this.aim=aim;
    this.sync(dt);
    if(i.firing&&this.fire<=0){const interval=game.combat.firePlayer(this);if(interval)this.fire=interval*(this.fireBuff>0?.55:1);}
    this.trail-=dt;if(this.trail<=0&&(m.x||m.z||dashing||this.hp<30)){this.trail=.14;game.effects.emit(this.x,.2,this.z,dashing?0xc6fff0:this.hp<30?0x8e8e87:0xded5ba,dashing?2:1,.3);}
    this.model.halo.material=game.material(this.invulnerable>0?0xffffff:this.stamina>=c.dashCost?0xb6ffdf:0xf1af85,true);
  }
  sync(dt){const m=this.model;m.root.position.set(this.x,0,this.z);m.body.rotation.y=this.angle;m.turret.rotation.y=this.aim;m.flashTime=Math.max(0,m.flashTime-dt);m.flash.visible=m.flashTime>0;m.root.visible=true;}
  hurt(amount,game){if(this.invulnerable>0||this.hp<=0)return;this.hp=Math.max(0,this.hp-amount);this.invulnerable=CONFIG.player.hurtGrace;game.combo=0;game.comboTime=0;game.effects.emit(this.x,.8,this.z,0xfff3d0,10,.5);game.effects.shake=.18;game.ui.hit();game.audio.play('hit');if(this.hp<=0)game.end();}
  dispose(){this.model.root.removeFromParent();}
}
