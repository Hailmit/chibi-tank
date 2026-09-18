import { CONFIG } from './config.js';
export const TILE = { ROAD: 0, BRICK: 1, STEEL: 2, HOUSE: 3, TREE: 4, BARREL: 5, GRASS: 6, HIGHRISE: 7, SHOP: 8, RUBBLE: 9 };
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export const walkable = t => t === TILE.ROAD || t === TILE.GRASS || t === TILE.RUBBLE;
export const solidShot = t => !walkable(t);
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function screenDirection(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: (x + y) / length / Math.SQRT2, z: (-x + y) / length / Math.SQRT2 };
}
export function turn(current, target, factor) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * factor;
}
// Earliest segment / expanded AABB intersection, including a segment starting inside.
export function segmentBox(ax, az, bx, bz, minX, minZ, maxX, maxZ) {
  let lo = 0, hi = 1;
  for (const [a, d, min, max] of [[ax, bx-ax, minX, maxX], [az, bz-az, minZ, maxZ]]) {
    if (Math.abs(d) < 1e-9) { if (a < min || a > max) return null; }
    else { let t1 = (min-a)/d, t2 = (max-a)/d; if (t1>t2) [t1,t2]=[t2,t1]; lo=Math.max(lo,t1); hi=Math.min(hi,t2); if(lo>hi) return null; }
  }
  return lo;
}
export function segmentCircle(ax, az, bx, bz, x, z, radius) {
  const dx=bx-ax, dz=bz-az, ox=ax-x, oz=az-z, c=ox*ox+oz*oz-radius*radius;
  if (c<=0) return 0;
  const a=dx*dx+dz*dz, b=2*(ox*dx+oz*dz), discriminant=b*b-4*a*c;
  if (!a || discriminant<0) return null;
  const t=(-b-Math.sqrt(discriminant))/(2*a); return t>=0&&t<=1 ? t : null;
}
export class Grid {
  constructor(seed=1) {
    this.size=CONFIG.world.size; this.cell=CONFIG.world.cell; this.half=this.size*this.cell/2;
    this.random=rng(seed); this.seed=seed; this.version=0; this.tiles=new Uint8Array(this.size*this.size);
    this.hp=new Float32Array(this.tiles.length); this.generate();
  }
  index(x,z) { return z*this.size+x; }
  coords(i) { return {x:i%this.size,z:Math.floor(i/this.size)}; }
  center(i) { const p=this.coords(i); return {x:(p.x+.5)*this.cell-this.half,z:(p.z+.5)*this.cell-this.half}; }
  at(x,z) { const c=Math.floor((x+this.half)/this.cell), r=Math.floor((z+this.half)/this.cell); return c<0||r<0||c>=this.size||r>=this.size ? -1:this.index(c,r); }
  neighbors(i) { const {x,z}=this.coords(i), out=[]; if(x>0)out.push(i-1); if(x<this.size-1)out.push(i+1); if(z>0)out.push(i-this.size); if(z<this.size-1)out.push(i+this.size); return out; }
  obstacleTile(tiles,x,z) {
    const choices=[TILE.BRICK,TILE.STEEL,TILE.HOUSE,TILE.TREE,TILE.BARREL];
    const weights=[.24,.09,.42,.17,.08];
    // Neighbour bias grows small districts instead of alternating one prop per cell.
    const neighbours=[];
    if(x>0&&!walkable(tiles[this.index(x-1,z)]))neighbours.push(tiles[this.index(x-1,z)]);
    if(z>0&&!walkable(tiles[this.index(x,z-1)]))neighbours.push(tiles[this.index(x,z-1)]);
    if(neighbours.length&&this.random()<.58){const type=neighbours[Math.floor(this.random()*neighbours.length)];if(type!==TILE.BARREL)return type;}
    let roll=this.random();for(let i=0;i<choices.length;i++){roll-=weights[i];if(roll<=0)return choices[i];}return TILE.BRICK;
  }
  carve(tiles,x,z,radius=0,type=TILE.ROAD) {
    for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
      const px=x+dx,pz=z+dz;if(px>=0&&pz>=0&&px<this.size&&pz<this.size&&Math.abs(dx)+Math.abs(dz)<=radius)tiles[this.index(px,pz)]=type;
    }
  }
  carvePath(tiles,from,to,width=0) {
    let x=from.x,z=from.z,guard=this.size*this.size;
    this.carve(tiles,x,z,width);
    while((x!==to.x||z!==to.z)&&guard-->0){
      const dx=to.x-x,dz=to.z-z,preferX=Math.abs(dx)/(Math.abs(dx)+Math.abs(dz)||1);
      // A little sideways drift removes long, ruler-straight avenues while the
      // target bias still guarantees that every branch joins the same network.
      if(this.random()<.08){
        if(this.random()<.5&&z>1&&z<this.size-2)z+=this.random()<.5?-1:1;
        else if(x>1&&x<this.size-2)x+=this.random()<.5?-1:1;
      }else if(dx&&(!dz||this.random()<preferX))x+=Math.sign(dx);
      else if(dz)z+=Math.sign(dz);
      x=clamp(x,1,this.size-2);z=clamp(z,1,this.size-2);this.carve(tiles,x,z,width);
      if(this.random()<.045)this.carve(tiles,x,z,1);
    }
  }
  zoneDistricts(tiles) {
    const mid=(this.size-1)/2,eligible=i=>!walkable(tiles[i]),fronts=[];
    for(let i=0;i<tiles.length;i++)if(eligible(i)&&this.neighbors(i).some(n=>walkable(tiles[n])))fronts.push(i);
    // Pick one compact downtown instead of scattering towers through residential
    // blocks. The jitter changes the skyline per seed without breaking zoning.
    const downtown={x:mid+(this.random()-.5)*4,z:mid+(this.random()-.5)*4};
    const ranked=fronts.map(i=>{const p=this.coords(i);return {i,score:Math.hypot(p.x-downtown.x,p.z-downtown.z)+this.random()*1.8};}).sort((a,b)=>a.score-b.score);
    const anchor=this.coords(ranked[0]?.i??this.index(mid,mid)),towers=[];
    const towerPool=ranked.filter(({i})=>{const p=this.coords(i);return Math.hypot(p.x-anchor.x,p.z-anchor.z)<6.5;});
    for(const {i} of towerPool){if(towers.length>=9)break;tiles[i]=TILE.HIGHRISE;towers.push(i);}
    for(const {i} of ranked)if(towers.length<7&&tiles[i]!==TILE.HIGHRISE){tiles[i]=TILE.HIGHRISE;towers.push(i);}
    const nearTower=i=>{const p=this.coords(i);return towers.some(t=>{const q=this.coords(t);return Math.max(Math.abs(p.x-q.x),Math.abs(p.z-q.z))<=1;});};
    // A one-cell public plaza gives the downtown skyline a believable setback;
    // homes and shops begin outside it instead of touching tower footprints.
    const plaza=[];for(let i=0;i<tiles.length;i++)if(tiles[i]!==TILE.HIGHRISE&&nearTower(i)&&!walkable(tiles[i]))plaza.push(i);
    let opened=true;while(opened){opened=false;for(const i of plaza)if(!walkable(tiles[i])&&this.neighbors(i).some(n=>walkable(tiles[n]))){tiles[i]=TILE.ROAD;opened=true;}}
    const shops=fronts.filter(i=>tiles[i]!==TILE.HIGHRISE&&eligible(i)&&!nearTower(i)).map(i=>{const p=this.coords(i);return {i,score:Math.hypot(p.x-downtown.x,p.z-downtown.z)+this.random()*5};}).sort((a,b)=>a.score-b.score);
    let shopCount=tiles.reduce((n,t)=>n+(t===TILE.SHOP),0);for(const {i} of shops){if(shopCount>=14)break;tiles[i]=TILE.SHOP;shopCount++;}
  }
  makeLayout() {
    const tiles=new Uint8Array(this.tiles.length);
    for(let z=0;z<this.size;z++)for(let x=0;x<this.size;x++)tiles[this.index(x,z)]=this.obstacleTile(tiles,x,z);
    const center={x:Math.floor(this.size/2),z:Math.floor(this.size/2)},nodes=[center];
    this.carve(tiles,center.x,center.z,1);
    // Random landmarks form a connected street tree. Connecting some landmarks
    // to a second parent adds loops, alternate routes and irregular intersections.
    for(let n=0;n<10;n++){
      const point={x:2+Math.floor(this.random()*(this.size-4)),z:2+Math.floor(this.random()*(this.size-4))};
      let parent=nodes[0],best=Infinity;for(const node of nodes){const d=Math.abs(node.x-point.x)+Math.abs(node.z-point.z);if(d<best){best=d;parent=node;}}
      this.carvePath(tiles,point,parent,this.random()<.08?1:0);this.carve(tiles,point.x,point.z,this.random()<.18?2:1);nodes.push(point);
      if(n>3&&this.random()<.28)this.carvePath(tiles,point,nodes[Math.floor(this.random()*(nodes.length-1))],0);
    }
    // Four entrances make every generated city approachable from every side.
    const gates=[{x:1,z:2+Math.floor(this.random()*(this.size-4))},{x:this.size-2,z:2+Math.floor(this.random()*(this.size-4))},{x:2+Math.floor(this.random()*(this.size-4)),z:1},{x:2+Math.floor(this.random()*(this.size-4)),z:this.size-2}];
    for(const gate of gates){let parent=nodes[0],best=Infinity;for(const node of nodes){const d=Math.abs(node.x-gate.x)+Math.abs(node.z-gate.z);if(d<best){best=d;parent=node;}}this.carvePath(tiles,gate,parent,0);this.carve(tiles,gate.x,gate.z,0);}
    // Four compact parks replace arbitrary green patches. Each one touches a
    // street and receives trees while connectivity is checked after every tree.
    const roads=[],parkSeeds=[];tiles.forEach((t,i)=>{if(t===TILE.ROAD)roads.push(i);});
    for(let n=0;n<4;n++){
      const sites=[];for(const road of roads)for(const i of this.neighbors(road))if(tiles[i]!==TILE.ROAD){
        const p=this.coords(i);if(Math.hypot(p.x-center.x,p.z-center.z)>3&&parkSeeds.every(q=>Math.hypot(p.x-q.x,p.z-q.z)>5))sites.push({road,seed:p});
      }
      if(!sites.length)continue;const site=sites[Math.floor(this.random()*sites.length)],road=site.road,seed=site.seed,radius=n===0&&this.random()<.55?2:1,park=[];parkSeeds.push(seed);
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){const x=seed.x+dx,z=seed.z+dz;if(x>0&&z>0&&x<this.size-1&&z<this.size-1&&Math.abs(dx)+Math.abs(dz)<=radius+1){const i=this.index(x,z);tiles[i]=TILE.GRASS;park.push(i);}}
      tiles[road]=TILE.ROAD;
      const edge=park.filter(i=>i!==road&&this.neighbors(i).some(j=>!park.includes(j))).sort(()=>this.random()-.5);let planted=0;
      for(const i of edge){if(planted>=2)break;tiles[i]=TILE.TREE;if(this.connected(tiles))planted++;else tiles[i]=TILE.GRASS;}
    }
    this.carve(tiles,center.x,center.z,1);
    // Remove the rare accidental full-width straight line without sacrificing
    // connectivity. This keeps every seed from reading like a regular grid.
    for(let axis=0;axis<2;axis++)for(let line=1;line<this.size-1;line++){
      const cells=Array.from({length:this.size},(_,n)=>axis?this.index(line,n):this.index(n,line));
      if(!cells.every(i=>walkable(tiles[i])))continue;
      for(let tries=0;tries<20;tries++){const i=cells[2+Math.floor(this.random()*(this.size-4))];if(i===this.index(center.x,center.z))continue;const old=tiles[i];tiles[i]=TILE.HOUSE;if(this.connected(tiles))break;tiles[i]=old;}
    }
    this.zoneDistricts(tiles);
    return tiles;
  }
  generate() {
    this.tiles.set(this.makeLayout());
    this.resetHP();this.version++;
  }
  tileHP(type) { return type===TILE.BRICK?55:type===TILE.STEEL?140:type===TILE.HOUSE?90:type===TILE.TREE?35:type===TILE.BARREL?20:type===TILE.HIGHRISE?180:type===TILE.SHOP?75:Infinity; }
  resetHP() { for(let i=0;i<this.tiles.length;i++)this.hp[i]=this.tileHP(this.tiles[i]); }
  flood(start,tiles=this.tiles) {
    const seen=new Uint8Array(tiles.length); if(start<0||!walkable(tiles[start]))return seen;
    const queue=[start];seen[start]=1;
    for(let q=0;q<queue.length;q++)for(const n of this.neighbors(queue[q]))if(!seen[n]&&walkable(tiles[n])){seen[n]=1;queue.push(n);}
    return seen;
  }
  connected(tiles=this.tiles) { const seen=this.flood(this.index(12,12),tiles);return tiles.every((t,i)=>!walkable(t)||seen[i]); }
  path(start,end) {
    if(start<0||end<0||!walkable(this.tiles[start])||!walkable(this.tiles[end]))return [];
    const parent=new Int32Array(this.tiles.length).fill(-1),queue=[start];parent[start]=start;
    for(let q=0;q<queue.length && parent[end]<0;q++)for(const n of this.neighbors(queue[q]))if(parent[n]<0&&walkable(this.tiles[n])){parent[n]=queue[q];queue.push(n);}
    if(parent[end]<0)return [];const result=[];for(let i=end;i!==start;i=parent[i])result.push(i);return result.reverse();
  }
  free(x,z,r=.62,tiles=this.tiles) {
    if(Math.abs(x)+r>this.half||Math.abs(z)+r>this.half)return false;
    const minX=Math.floor((x-r+this.half)/this.cell),maxX=Math.floor((x+r+this.half)/this.cell);
    const minZ=Math.floor((z-r+this.half)/this.cell),maxZ=Math.floor((z+r+this.half)/this.cell);
    for(let cz=minZ;cz<=maxZ;cz++)for(let cx=minX;cx<=maxX;cx++) {
      if(walkable(tiles[this.index(cx,cz)]))continue;
      const left=cx*this.cell-this.half,top=cz*this.cell-this.half;
      if(Math.hypot(x-clamp(x,left,left+this.cell),z-clamp(z,top,top+this.cell))<r)return false;
    }return true;
  }
  move(entity,dx,dz) {
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.2));
    for(let n=0;n<steps;n++){if(this.free(entity.x+dx/steps,entity.z,entity.radius))entity.x+=dx/steps;if(this.free(entity.x,entity.z+dz/steps,entity.radius))entity.z+=dz/steps;}
  }
  trace(ax,az,bx,bz,radius=0) {
    let hit=null;
    const minX=clamp(Math.floor((Math.min(ax,bx)-radius+this.half)/this.cell),0,this.size-1),maxX=clamp(Math.floor((Math.max(ax,bx)+radius+this.half)/this.cell),0,this.size-1);
    const minZ=clamp(Math.floor((Math.min(az,bz)-radius+this.half)/this.cell),0,this.size-1),maxZ=clamp(Math.floor((Math.max(az,bz)+radius+this.half)/this.cell),0,this.size-1);
    for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
      const i=this.index(x,z);if(!solidShot(this.tiles[i]))continue;
      const left=x*this.cell-this.half,top=z*this.cell-this.half;
      const t=segmentBox(ax,az,bx,bz,left-radius,top-radius,left+this.cell+radius,top+this.cell+radius);
      if(t!==null&&(!hit||t<hit.t))hit={i,t};
    }return hit;
  }
  damage(i,amount) { if(i<0||!Number.isFinite(this.hp[i]))return false;const destroyed=this.tiles[i];this.hp[i]-=amount;if(this.hp[i]>0)return false;this.tiles[i]=destroyed===TILE.TREE||destroyed===TILE.BARREL?TILE.GRASS:TILE.RUBBLE;this.hp[i]=Infinity;this.version++;return true; }
}
export function readStorage(key,fallback) { try { const value=localStorage.getItem(key); return value===null?fallback:JSON.parse(value); } catch { return fallback; } }
export function writeStorage(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* Private browsing: the current run still works. */ } }
