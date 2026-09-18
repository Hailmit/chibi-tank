import * as THREE from 'three';
import { screenDirection } from './core.js';
export class Input {
  constructor(canvas,onPause,onRestart) {
    this.keys=new Set();this.mouse=new THREE.Vector2(0,0);this.firing=false;this.dash=false;this.pointerKnown=false;
    this.touchMove={x:0,y:0};this.touchAim={x:0,y:0};this.touchCapable=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
    document.body.classList.toggle('touch',this.touchCapable);
    this.ray=new THREE.Raycaster();this.plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.target=new THREE.Vector3(0,0,5);
    const controls=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
    window.addEventListener('keydown',e=>{
      if(e.target.matches?.('input,select')&&e.code!=='Escape')return;
      if(e.target.matches?.('button')&&(e.code==='Space'||e.code==='Enter'))return;
      if(controls.includes(e.code))e.preventDefault();this.keys.add(e.code);
      if(!e.repeat&&e.code==='Space')this.dash=true;
      if(!e.repeat&&e.code==='Escape')onPause();if(!e.repeat&&e.code==='KeyR')onRestart();
    });
    window.addEventListener('keyup',e=>this.keys.delete(e.code));
    canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;this.clientX=e.clientX;this.clientY=e.clientY;this.pointerKnown=true;});
    canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0){this.clientX=e.clientX;this.clientY=e.clientY;this.pointerKnown=true;this.firing=true;}});
    window.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')this.firing=false;});
    canvas.addEventListener('pointerleave',()=>this.firing=false);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('blur',()=>{this.clear();onPause(true);});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.clear();onPause(true);}});
    this.bindStick(document.getElementById('move-stick'),this.touchMove,false);
    this.bindStick(document.getElementById('aim-stick'),this.touchAim,true);
    const dashButton=document.getElementById('dash-button');
    dashButton.addEventListener('pointerdown',e=>{e.preventDefault();if(!dashButton.disabled){this.dash=true;dashButton.classList.add('pressed');navigator.vibrate?.(12);}});
    const releaseDash=()=>dashButton.classList.remove('pressed');dashButton.addEventListener('pointerup',releaseDash);dashButton.addEventListener('pointercancel',releaseDash);
    this.canvas=canvas;
  }
  bindStick(element,value,fires){
    if(!element)return;const knob=element.querySelector('.stick-knob');let active=null;
    const update=e=>{if(e.pointerId!==active)return;const r=element.getBoundingClientRect(),radius=Math.max(24,Math.min(r.width,r.height)*.32),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),length=Math.hypot(dx,dy),scale=Math.min(1,radius/(length||1));value.x=dx*scale/radius;value.y=dy*scale/radius;if(Math.hypot(value.x,value.y)<.12)value.x=value.y=0;knob.style.transform=`translate(${value.x*radius}px,${value.y*radius}px)`;if(fires)this.firing=!!(value.x||value.y);};
    const release=e=>{if(active!==null&&e.pointerId!==active)return;active=null;value.x=value.y=0;knob.style.transform='translate(0,0)';element.classList.remove('active');if(fires)this.firing=false;};
    element.addEventListener('pointerdown',e=>{e.preventDefault();active=e.pointerId;try{element.setPointerCapture(active);}catch{}element.classList.add('active');update(e);});
    element.addEventListener('pointermove',update);element.addEventListener('pointerup',release);element.addEventListener('pointercancel',release);element.addEventListener('lostpointercapture',release);
  }
  clear(){this.keys.clear();this.firing=false;this.dash=false;this.touchMove.x=this.touchMove.y=this.touchAim.x=this.touchAim.y=0;document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');document.querySelectorAll('.touch-stick').forEach(el=>el.classList.remove('active'));}
  movement(){const x=this.touchMove.x||Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft')),y=this.touchMove.y||Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'));return screenDirection(x,y);}
  aim(camera,origin){if(this.touchAim.x||this.touchAim.y){const d=screenDirection(this.touchAim.x,this.touchAim.y);this.target.set((origin?.x||0)+d.x*20,0,(origin?.z||0)+d.z*20);}else if(this.pointerKnown){this.mouse.set(this.clientX/innerWidth*2-1,-this.clientY/innerHeight*2+1);this.ray.setFromCamera(this.mouse,camera);this.ray.ray.intersectPlane(this.plane,this.target);}return this.target;}
}
