import { TILE } from '../src/core.js';
import { CONFIG } from '../src/config.js';
import { applyUpgrade, UPGRADE_MAX_LEVEL } from '../src/upgrades.js';
export function runIntegrationTests(g){
  const results=[];
  const assert=(condition,message='Assertion failed')=>{if(!condition)throw new Error(message);};
  const fresh=()=>{g.start();g.world.grid.tiles.fill(TILE.ROAD);g.world.grid.resetHP();g.world.grid.version++;g.player.aim=Math.PI/2;g.player.sync(0);};
  const test=(name,fn)=>{try{fresh();fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}};
  test('Muzzle inside cover cannot fire through it; cover destruction opens line of fire',()=>{
    const grid=g.world.grid,i=grid.index(13,12);grid.tiles[i]=TILE.BRICK;grid.hp[i]=50;g.enemies.spawn({type:'scout',x:7.2,z:0});const e=g.enemies.list[0],hp=e.hp;
    g.combat.shoot(g.player,'player',28);for(let n=0;n<30;n++)g.combat.update(1/60);assert(e.hp===hp);assert(grid.hp[i]===22);
    g.combat.shoot(g.player,'player',28);assert(grid.tiles[i]===TILE.RUBBLE);g.combat.shoot(g.player,'player',28);for(let n=0;n<30;n++)g.combat.update(1/60);assert(e.hp<hp);
  });
  test('Barrels chain-react once without awarding obstacle points',()=>{
    const grid=g.world.grid;for(const x of [15,16,17]){const i=grid.index(x,12);grid.tiles[i]=TILE.BARREL;grid.hp[i]=20;}
    const score=g.score;g.world.damage(grid.index(15,12),100,g);assert([15,16,17].every(x=>grid.tiles[grid.index(x,12)]===TILE.GRASS));assert(g.score===score);
  });
  test('Mortar warning precedes delayed area damage',()=>{
    g.enemies.spawn({type:'mortar',x:12,z:0});const e=g.enemies.list[0];g.combat.mortar(e,0,0);const shell=g.combat.shells.find(s=>s.active);assert(shell&&shell.marker.visible);
    for(let i=0;i<90;i++)g.combat.update(1/60);assert(g.player.hp===100&&shell.active);for(let i=0;i<15;i++)g.combat.update(1/60);assert(g.player.hp===76&&!shell.active);
  });
  test('Elite alternates five-shot fan and three mortar targets',()=>{
    g.enemies.spawn({type:'elite',x:12,z:0});const e=g.enemies.list[0];g.enemies.attack(e);assert(g.combat.bullets.filter(b=>b.active).length===5);g.enemies.attack(e);assert(g.combat.shells.filter(s=>s.active).length===3);
  });
  test('Night turns active and newly spawned enemies into double-HP zombies',()=>{
    g.enemies.spawn({type:'scout',x:12,z:0});const active=g.enemies.list[0],base=active.maxHP;active.hp=base*.5;g.setNight(true,true,true);assert(active.zombie&&active.maxHP===base*2&&active.hp===base&&active.model.zombie.visible);
    g.enemies.spawn({type:'gunner',x:-12,z:0});const spawned=g.enemies.list[1];assert(spawned.zombie&&spawned.maxHP===spawned.baseMaxHP*2);
    g.setNight(false,true,true);assert(!active.zombie&&active.maxHP===base&&active.hp===base*.5&&!active.model.zombie.visible);
  });
  test('Day and night alternate every sixty gameplay seconds',()=>{
    g.enemies.spawn({type:'scout',x:12,z:0});g.time=CONFIG.world.phaseDuration-.01;g.step(.02);assert(g.isNight&&g.enemies.list[0].zombie);g.time=CONFIG.world.phaseDuration*2-.01;g.step(.02);assert(!g.isNight&&!g.enemies.list[0].zombie);
  });
  test('Every 120 seconds offers one choice and freezes combat until selected',()=>{
    g.player.hp=40;g.time=119.99;g.step(.02);const frozen=g.time;
    assert(g.state==='upgrade'&&!document.getElementById('upgrade-overlay').hidden&&document.getElementById('overlay').hidden);
    g.step(1);g.togglePause();assert(g.state==='upgrade'&&g.time===frozen);
    assert(g.chooseUpgrade('armor')&&g.state==='playing'&&g.player.armorLevel===1&&g.player.maxHP===125&&g.player.hp===65);
    assert(!g.chooseUpgrade('cannon')&&g.player.cannonLevel===0);
    g.step(.02);assert(g.state==='playing','Upgrade repeated before the next interval');
    g.time=239.99;g.step(.02);assert(g.state==='upgrade');document.getElementById('upgrade-engine').click();assert(g.state==='playing'&&g.player.speedMultiplier===1.1&&g.player.staminaRegenMultiplier===1.15);
    g.time=359.99;g.step(.02);assert(g.state==='upgrade');document.getElementById('upgrade-cannon').click();assert(g.player.cannonLevel===1&&g.player.damageMultiplier===1.12);
    g.combat.firePlayer(g.player);assert(g.combat.bullets.some(b=>b.active&&b.damage===Math.round(CONFIG.player.damage*1.12)));
    g.start();assert(g.player.armorLevel===0&&g.player.engineLevel===0&&g.player.cannonLevel===0&&g.player.maxHP===CONFIG.player.hp);
    g.time=119.99;g.step(.02);document.getElementById('upgrade-home').click();assert(g.state==='menu'&&document.getElementById('upgrade-overlay').hidden);
  });
  test('Maxed upgrades give a useful immediate reward without raising permanent caps',()=>{
    for(let i=0;i<UPGRADE_MAX_LEVEL;i++){applyUpgrade(g.player,'armor');applyUpgrade(g.player,'engine');applyUpgrade(g.player,'cannon');}
    assert(g.player.maxHP===200&&g.player.speedMultiplier===1.4&&g.player.damageMultiplier===1.48);
    g.player.hp=50;g.player.stamina=0;applyUpgrade(g.player,'armor');applyUpgrade(g.player,'engine');applyUpgrade(g.player,'cannon');
    assert(g.player.maxHP===200&&g.player.hp===100&&g.player.stamina===100&&g.player.speedBuff===8&&g.player.fireBuff===10&&g.player.damageMultiplier===1.48);
  });
  test('Elite can enter a saturated regular enemy population',()=>{
    for(let i=0;i<CONFIG.director.maxEnemies-1;i++)g.enemies.spawn({type:'scout',x:-24+(i%5)*2.4,z:-24+Math.floor(i/5)*2.4});
    assert(!g.enemies.schedule('gunner'));assert(g.enemies.schedule('elite'));assert(g.enemies.list.length+g.enemies.pending.length===CONFIG.director.maxEnemies);
  });
  test('Spawn cancelled if player enters its safety radius during warning',()=>{
    assert(g.enemies.schedule('scout'));const spawn=g.enemies.pending[0];g.player.x=spawn.x;g.player.z=spawn.z;g.enemies.spawnTimer=100;g.enemies.update(2);assert(g.enemies.pending.length===0&&g.enemies.list.length===0);
  });
  test('Spawn selection uses one reachability flood instead of per-cell paths',()=>{
    const grid=g.world.grid,originalFlood=grid.flood.bind(grid),originalPath=grid.path.bind(grid);let floods=0,paths=0;grid.flood=(...args)=>{floods++;return originalFlood(...args);};grid.path=(...args)=>{paths++;return originalPath(...args);};
    const scheduled=g.enemies.schedule('scout');grid.flood=originalFlood;grid.path=originalPath;assert(scheduled,'Spawn scheduling failed');assert(floods===1,`Expected 1 flood, got ${floods}`);assert(paths===0,`Expected 0 paths, got ${paths}`);
  });
  test('Assault director schedules a rapid reinforcement wave without exceeding the cap',()=>{
    g.enemies.assaultTimer=.01;g.enemies.spawnTimer=100;g.enemies.update(.02);const wave=g.enemies.assaultRemaining;assert(wave>=3);g.enemies.spawnTimer=0;g.enemies.update(.01);assert(g.enemies.assaultRemaining===wave-1&&g.enemies.spawnTimer===CONFIG.director.assaultGap);assert(g.enemies.list.length+g.enemies.pending.length<=CONFIG.director.maxEnemies);
  });
  test('High-rises and shops absorb shots, collapse to rubble and open a lane',()=>{
    const grid=g.world.grid;for(const [x,type] of [[13,TILE.HIGHRISE],[14,TILE.SHOP]]){const i=grid.index(x,12);grid.tiles[i]=type;grid.hp[i]=grid.tileHP(type);g.world.rebuild(i);assert(!grid.free(grid.center(i).x,grid.center(i).z,.2));g.world.damage(i,grid.hp[i],g);assert(grid.tiles[i]===TILE.RUBBLE&&grid.free(grid.center(i).x,grid.center(i).z,.2));}
  });
  test('Combo caps at five, expires, and damage resets it',()=>{
    for(let i=0;i<8;i++)g.onKill({points:100,x:0,z:0});assert(g.combo===5&&g.maxCombo===5);g.comboTime=.001;g.step(1/60);assert(g.combo===0);g.onKill({points:100,x:0,z:0});g.player.hurt(1,g);assert(g.combo===0&&g.comboTime===0);
  });
  test('Sustained fire continues without heat or lockout state',()=>{
    g.input.firing=true;for(let i=0;i<20;i++){g.player.fire=0;g.player.update(.01,g);}const shots=g.combat.bullets.filter(b=>b.active).length;
    assert(shots===20);assert(!('heat' in g.player)&&!('overheated' in g.player));assert(!('heatMax' in CONFIG.player)&&!('heatPerShot' in CONFIG.player));
  });
  test('All four pickup effects apply and expire',()=>{
    for(let type=0;type<4;type++){g.combat.spawnPickup(type,0,0);g.player.hp=50;g.player.stamina=20;g.combat.update(1/60);if(type===0)assert(g.player.hp===80);if(type===1)assert(g.player.stamina===100);if(type===2)assert(g.player.speedBuff===8);if(type===3)assert(g.player.fireBuff===8);}g.input.clear();for(let i=0;i<481;i++)g.player.update(1/60,g);assert(g.player.speedBuff===0&&g.player.fireBuff===0&&g.combat.pickups.length===0);
  });
  test('All four weapon drops can appear and pickups equip or refill ammo',()=>{
    const ids=['rocket','shotgun','flame','electric'],random=g.world.grid.random;
    for(let i=0;i<4;i++){let calls=0;g.world.grid.random=()=>calls++===0?0:[.05,.15,.25,.35][i];g.combat.drop(10+i*2,0);assert(g.combat.pickups.at(-1)?.type===i+4&&g.combat.pickups.at(-1).mesh.children.length===1);g.combat.spawnPickup(i+4,0,0);g.combat.update(1/60);assert(g.player.weapon===ids[i]&&g.player.ammo===CONFIG.weapons[ids[i]].ammo);}
    g.world.grid.random=random;g.combat.spawnPickup(7,0,0);g.combat.update(1/60);assert(g.player.ammo===CONFIG.weapons.electric.maxAmmo);g.ui.update(0);assert(!document.getElementById('weapon-status').hidden&&document.getElementById('weapon-ammo').textContent===String(g.player.ammo));
    g.player.ammo=1;g.combat.firePlayer(g.player);g.ui.update(0);assert(g.player.weapon==='normal'&&g.player.ammo===0&&document.getElementById('weapon-status').hidden);
  });
  test('Rocket is a pooled projectile with splash damage',()=>{
    g.enemies.spawn({type:'gunner',x:6,z:0});g.enemies.spawn({type:'gunner',x:7.2,z:1.5});const [first,second]=g.enemies.list;
    g.player.equipWeapon('rocket');assert(g.combat.firePlayer(g.player)===CONFIG.weapons.rocket.interval);const rocket=g.combat.bullets.find(b=>b.active&&b.kind==='rocket');assert(rocket&&g.player.ammo===7);
    for(let i=0;i<20&&rocket.active;i++)g.combat.update(1/30);
    assert(!rocket.active&&first.hp<first.maxHP&&second.hp<second.maxHP&&g.combat.activeBullets.size===0);
  });
  test('Shotgun fires one six-pellet short-range fan per shell',()=>{
    g.player.equipWeapon('shotgun');g.combat.firePlayer(g.player);const pellets=[...g.combat.activeBullets];assert(pellets.length===6&&pellets.every(b=>b.kind==='pellet')&&g.player.ammo===19);assert(new Set(pellets.map(b=>Math.round(Math.atan2(b.vx,b.vz)*100))).size===6);g.combat.update(.5);assert(g.combat.activeBullets.size===0);
  });
  test('Flame burns visible targets and cannot pass through cover',()=>{
    g.enemies.spawn({type:'heavy',x:5,z:0});const e=g.enemies.list[0];g.player.equipWeapon('flame');const hp=e.hp;g.combat.firePlayer(g.player);assert(e.hp<hp&&e.burn>0);g.enemies.spawnTimer=100;g.enemies.update(.46);assert(e.hp<hp-CONFIG.weapons.flame.damage);
    e.burn=0;const blockedHP=e.hp,i=g.world.grid.index(13,12);g.world.grid.tiles[i]=TILE.BRICK;g.world.grid.hp[i]=50;g.world.rebuild(i);g.effects.clear();g.combat.firePlayer(g.player);assert(e.hp===blockedHP&&g.world.grid.hp[i]<50&&[...g.effects.active].every(index=>g.effects.particles[index].x<2));
  });
  test('Electricity chains between enemies and briefly stuns them',()=>{
    g.enemies.spawn({type:'gunner',x:5,z:0});g.enemies.spawn({type:'gunner',x:8,z:0});const [first,second]=g.enemies.list;g.player.equipWeapon('electric');g.combat.firePlayer(g.player);assert(first.hp<first.maxHP&&second.hp<second.maxHP&&first.stun>0&&second.stun>0&&g.effects.arcs.filter(a=>a.line.visible).length>=2);const x=first.x;g.enemies.spawnTimer=100;g.enemies.update(.1);assert(first.x===x);
  });
  test('Sustained special fire respects the existing projectile pool',()=>{
    g.player.equipWeapon('shotgun');g.player.equipWeapon('shotgun');for(let i=0;i<40;i++)g.combat.firePlayer(g.player);assert(g.combat.activeBullets.size===CONFIG.combat.maxBullets&&g.player.ammo===10);g.combat.update(1);assert(g.combat.activeBullets.size===0);g.combat.firePlayer(g.player);assert(g.combat.activeBullets.size===6&&g.player.ammo===9);
  });
  test('Special shots use distinct bounded visual effects',()=>{
    g.player.equipWeapon('rocket');g.combat.firePlayer(g.player);const rocket=g.combat.bullets.find(b=>b.active&&b.kind==='rocket');assert(rocket.mesh.geometry===g.combat.rocketGeometry&&rocket.mesh.material===g.combat.playerRoundMaterial&&rocket.mesh.scale.x>=1.2);g.combat.update(.1);assert([...g.effects.active].some(i=>g.effects.particles[i].color===0x8d9694));g.combat.explode(4,0,2.8,0,'player','rocket');assert(g.effects.rings.some(r=>r.mesh.visible&&r.mesh.material.color.getHex()===0xff9b50));
    g.combat.clear();g.effects.clear();g.player.equipWeapon('shotgun');g.combat.firePlayer(g.player);assert([...g.combat.activeBullets].every(b=>b.mesh.geometry===g.combat.pelletGeometry&&b.mesh.scale.x>=1.35));assert([...g.effects.active].length===7,'Shotgun should emit one shared muzzle fan');
    g.effects.clear();g.player.equipWeapon('flame');g.combat.firePlayer(g.player);assert([...g.effects.active].length===12);assert([...g.effects.active].every(i=>g.effects.particles[i].x<6.5));
    g.effects.clear();g.player.equipWeapon('electric');g.combat.firePlayer(g.player);const arc=g.effects.arcs.find(a=>a.line.visible);assert(arc&&arc.halo.visible&&arc.positions.length===21);assert(g.effects.active.size<=CONFIG.effects.high);g.effects.update(.3);assert(!arc.line.visible&&!arc.halo.visible);
  });
  test('City layout stays fixed through long survival and still reacts to destruction',()=>{
    const grid=g.world.grid,i=grid.index(13,12);grid.tiles[i]=TILE.BRICK;grid.hp[i]=grid.tileHP(TILE.BRICK);g.world.rebuild(i);
    const before=grid.tiles.slice(),version=grid.version;g.time=40;g.step(1/30);g.time=600;g.step(1/30);
    assert(grid.version===version&&grid.tiles.every((tile,i)=>tile===before[i]),'Map changed without damage');
    g.world.damage(i,grid.hp[i],g);assert(grid.tiles[i]===TILE.RUBBLE&&grid.version===version+1&&grid.connected(),'Destroyed roadside cover did not open a connected tile');
  });
  test('Brighter explosions fade while instanced particles stay capped',()=>{
    g.effects.explosion(0,0,2);const ring=g.effects.rings.find(r=>r.mesh.visible);assert(ring&&ring.mesh.material.opacity===.8);
    for(let i=0;i<20;i++)g.effects.explosion(i*.2,0,2);
    assert(g.effects.mesh.count===CONFIG.effects.high&&g.effects.active.size<=CONFIG.effects.high);
    g.effects.update(.19);assert(ring.mesh.material.opacity<.8);
  });
  test('Theme and battle music are distinct loops that follow game state',()=>{
    const audio=g.audio,theme=audio.musicBuffer('theme'),battle=audio.musicBuffer('battle');
    const energy=buffer=>{const samples=buffer.getChannelData(0);let total=0;for(let i=0;i<samples.length;i+=17)total+=samples[i]*samples[i];return Math.sqrt(total/Math.ceil(samples.length/17));};
    assert(theme.length>100000&&battle.length>100000&&theme.length!==battle.length&&energy(theme)>.025&&energy(battle)>.025);
    assert(audio.scene==='playing');g.togglePause();assert(audio.scene==='paused'&&!audio.musicVoice);g.togglePause();assert(audio.scene==='playing');
    g.end();assert(audio.scene==='over');g.home();assert(audio.scene==='menu');
    if(audio.context.state==='running')assert(audio.musicVoice?.track==='theme');
  });
  test('Buffered cannon shot has a strong transient and decaying tail',()=>{
    const buffer=g.audio.shotBuffer,data=buffer.getChannelData(0),rate=buffer.sampleRate;
    const rms=(start,end)=>{let energy=0,count=0;for(let i=Math.floor(start*rate);i<Math.floor(end*rate);i++){energy+=data[i]*data[i];count++;}return Math.sqrt(energy/count);};
    const crack=rms(.005,.065),tail=rms(.27,.38);
    assert(buffer.length>rate*.35&&crack>.035&&tail<crack*.6,`Unexpected cannon envelope: ${crack}, ${tail}`);
  });
  test('Active enemies invalidate cached paths after topology changes',()=>{
    g.enemies.spawn({type:'scout',x:19.2,z:0});const e=g.enemies.list[0];g.enemies.spawnTimer=100;g.enemies.update(1/60);assert(e.pathVersion===g.world.grid.version);const i=g.world.grid.index(19,12);g.world.grid.tiles[i]=TILE.BRICK;g.world.grid.hp[i]=1;g.world.damage(i,2,g);g.enemies.update(1/60);assert(e.pathVersion===g.world.grid.version);
  });
  test('Foreground house fades at full height and keeps collision',()=>{
    const world=g.world,i=world.grid.index(13,12);world.grid.tiles[i]=TILE.HOUSE;world.grid.hp[i]=Infinity;world.rebuild(i);world.fadeOccluders(g.player);
    assert(world.hiddenTiles.has(i));assert(world.ghosts.has(i));assert(world.tiles[i].scale.y===1);assert(world.ghosts.get(i).scale.y===1);
    assert(world.ghosts.get(i).children.every(part=>part.material.opacity===.18));assert(!world.grid.free(2.4,0,CONFIG.player.radius));
    g.player.x=-10;g.player.z=-10;world.fadeOccluders(g.player);assert(!world.hiddenTiles.has(i));assert(!world.ghosts.has(i));assert(world.tiles[i].scale.y===1);
  });
  g.start();g.world.fadeOccluders(g.player);g.ui.update(0);return results;
}
