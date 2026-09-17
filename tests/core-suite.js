import { Grid, TILE, rng, screenDirection, segmentBox, segmentCircle, walkable } from '../src/core.js';
import { CONFIG } from '../src/config.js';
export function runCoreTests(){
  const results=[];
  function test(name,fn){try{fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
  const assert=(condition,message='Assertion failed')=>{if(!condition)throw new Error(message);};
  test('Seed determinism and variation',()=>{const a=new Grid(100),b=new Grid(100),c=new Grid(101);assert(a.tiles.every((v,i)=>v===b.tiles[i]));assert(a.tiles.some((v,i)=>v!==c.tiles[i]));});
  test('100 irregular seeds: connected roads, clear spawn, no periodic avenues',()=>{for(let seed=0;seed<100;seed++){const g=new Grid(seed),seen=g.flood(g.index(12,12)),orphan=g.tiles.findIndex((t,i)=>walkable(t)&&!seen[i]);assert(orphan<0,`Disconnected seed ${seed} at ${JSON.stringify(g.coords(orphan))}`);assert(g.free(0,0,CONFIG.player.radius));const walkableCount=g.tiles.filter(walkable).length;assert(walkableCount>110&&walkableCount<360,`Bad road density ${seed}: ${walkableCount}`);for(let n=0;n<g.size;n++){let row=true,column=true;for(let j=0;j<g.size;j++){row&&=walkable(g.tiles[g.index(j,n)]);column&&=walkable(g.tiles[g.index(n,j)]);}assert(!row&&!column,`Straight full-map avenue in seed ${seed}`);}}});
  test('40 urban seeds use a downtown, commercial buffer and compact parks',()=>{for(let seed=0;seed<40;seed++){
    const g=new Grid(seed),count=type=>g.tiles.filter(t=>t===type).length,towers=[];
    g.tiles.forEach((t,i)=>{if(t===TILE.HIGHRISE)towers.push(i);});
    assert(towers.length>=7&&towers.length<=9,`Bad tower count ${seed}: ${towers.length}`);
    assert(count(TILE.SHOP)>=10,`Missing shops ${seed}`);
    assert(count(TILE.GRASS)>=8&&count(TILE.GRASS)<50,`Bad park area ${seed}: ${count(TILE.GRASS)}`);
    const points=towers.map(i=>g.coords(i)),cx=points.reduce((n,p)=>n+p.x,0)/points.length,cz=points.reduce((n,p)=>n+p.z,0)/points.length;
    assert(points.every(p=>Math.hypot(p.x-cx,p.z-cz)<8),`Scattered downtown ${seed}`);
    for(const p of points)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
      const x=p.x+dx,z=p.z+dz;if(x>=0&&z>=0&&x<g.size&&z<g.size){const i=g.index(x,z),tile=g.tiles[i];assert(tile===TILE.HIGHRISE||walkable(tile)||!g.neighbors(i).some(n=>walkable(g.tiles[n])),`Exposed low structure beside tower ${seed}`);}
    }
    assert(g.tiles.every(t=>t>=TILE.ROAD&&t<=TILE.RUBBLE),`Unknown terrain ${seed}`);assert(g.connected(),`Urban layout disconnected ${seed}`);
  }});
  test('Normalized camera-relative movement',()=>{for(const [x,y] of [[1,0],[0,-1],[1,1],[-1,-1]]){const d=screenDirection(x,y);assert(Math.abs(Math.hypot(d.x,d.z)-1)<1e-10);}const d=screenDirection(0,0);assert(d.x===0&&d.z===0);const up=screenDirection(0,-1);assert(up.x<0&&up.z<0);});
  test('Swept collision catches thin walls and earliest entry',()=>{assert(segmentBox(-10,0,10,0,-.1,-1,.1,1)===.495);assert(segmentBox(-10,2,10,2,-.1,-1,.1,1)===null);assert(segmentBox(0,0,10,0,-1,-1,1,1)===0);assert(Math.abs(segmentCircle(-10,0,10,0,0,0,1)-.45)<1e-8);});
  test('Dash substeps cannot tunnel through wall or world boundary',()=>{const g=new Grid(4);g.tiles.fill(TILE.ROAD);g.tiles[g.index(13,12)]=TILE.STEEL;const p={x:0,z:0,radius:.62};g.move(p,20,0);assert(p.x<.59);assert(g.free(p.x,p.z,p.radius));g.move(p,-200,0);assert(p.x>=-g.half+p.radius);});
  test('Destroyed wall becomes traversable rubble and updates navigation immediately',()=>{const g=new Grid(8);g.tiles.fill(TILE.ROAD);const i=g.index(13,12);g.tiles[i]=TILE.BRICK;g.hp[i]=g.tileHP(TILE.BRICK);const old=g.version;assert(g.trace(0,0,6,0)?.i===i);assert(!g.damage(i,28));assert(g.damage(i,28));assert(g.version===old+1&&g.tiles[i]===TILE.RUBBLE);assert(g.trace(0,0,6,0)===null);assert(g.path(g.index(12,12),g.index(14,12)).includes(i));assert(!g.damage(i,100));});
  test('Urban structures have durability and collapse into walkable terrain',()=>{const g=new Grid(9);for(const type of [TILE.STEEL,TILE.HOUSE,TILE.TREE,TILE.HIGHRISE,TILE.SHOP]){const i=g.tiles.findIndex(t=>t===type);assert(i>=0,`Missing type ${type}`);const hp=g.tileHP(type);assert(Number.isFinite(hp)&&hp>0);g.hp[i]=hp;assert(g.damage(i,hp));assert(walkable(g.tiles[i]));}});
  test('Moving entity invalidates its warned terrain cell',()=>{const g=new Grid(74),p={x:0,z:0,radius:.62},c=g.candidate([p]);assert(c,'No valid candidate');const point=g.center(c.indices[Math.floor(c.indices.length/2)]),e={...point,radius:.62};assert(!g.safeCandidate(c,[p,e]));});
  test('10 seeds × 12 irregular changes always alter topology and stay connected',()=>{for(let seed=0;seed<10;seed++){const g=new Grid(seed),p={x:0,z:0,radius:.62};for(let count=0;count<12;count++){const c=g.candidate([p]);assert(c,`No candidate ${seed}/${count}`);const before=g.tiles.slice(),version=g.version,selected=new Set(c.indices),changed=c.indices.filter(i=>before[i]!==c.tiles[i]),topology=changed.filter(i=>walkable(before[i])!==walkable(c.tiles[i]));assert(c.indices.length>=Math.ceil(g.tiles.length*.10)&&c.indices.length<=Math.floor(g.tiles.length*.18),`Bad region ${seed}/${count}: ${c.indices.length}`);assert(topology.length>=8,`Too little topology ${seed}/${count}: ${topology.length}`);const committed=g.commit(c);assert(committed.length>0,`No commit ${seed}/${count}`);assert(g.connected(),`Disconnected ${seed}/${count}`);assert(g.free(p.x,p.z,p.radius),`Player blocked ${seed}/${count}`);assert(g.version===version+1,`Version unchanged ${seed}/${count}`);for(let i=0;i<before.length;i++)if(!selected.has(i))assert(before[i]===g.tiles[i],`Changed outside region ${seed}/${count}`);}}});
  test('Pathfinding changes route after topology changes',()=>{const g=new Grid(1);g.tiles.fill(TILE.ROAD);const start=g.index(10,12),end=g.index(14,12),block=g.index(12,12);assert(g.path(start,end).includes(block));g.tiles[block]=TILE.STEEL;g.version++;const path=g.path(start,end);assert(!path.includes(block));assert(path.length>4);});
  return results;
}
