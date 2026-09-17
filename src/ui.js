import { CONFIG } from './config.js';
const $=id=>document.getElementById(id);
export const formatTime=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
export class UI {
  constructor(game){this.game=game;this.toastLife=0;this.hitLife=0;
    $('play').onclick=()=>game.start();$('resume').onclick=()=>game.togglePause();$('restart').onclick=()=>game.start();$('home').onclick=()=>game.home();$('fullscreen-button').onclick=()=>this.toggleFullscreen();for(const event of ['fullscreenchange','webkitfullscreenchange','MSFullscreenChange'])document.addEventListener(event,()=>this.syncFullscreen());this.syncFullscreen();this.show('menu');
  }
  fullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||document.msFullscreenElement;}
  fullscreenRequest(root=document.documentElement){return root.requestFullscreen||root.webkitRequestFullscreen||root.webkitRequestFullScreen||root.msRequestFullscreen;}
  fullscreenExit(){return document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen;}
  syncFullscreen(){const active=!!this.fullscreenElement(),button=$('fullscreen-button');button.classList.toggle('is-fullscreen',active);button.setAttribute('aria-label',active?'Thoát toàn màn hình':'Bật toàn màn hình');button.title=active?'Thoát toàn màn hình':'Toàn màn hình';}
  async toggleFullscreen(){
    try{
      if(this.fullscreenElement()){
        const exit=this.fullscreenExit();if(exit)await exit.call(document);screen.orientation?.unlock?.();
      }else{
        const root=document.documentElement,enter=this.fullscreenRequest(root);if(!enter){this.toast(/iPhone|iPod/.test(navigator.userAgent)?'iPhone: chọn Chia sẻ · Thêm vào Màn hình chính':'Trình duyệt này chưa hỗ trợ toàn màn hình');return;}
        await enter.call(root);if(this.game.touchDevice&&this.game.state==='playing')try{await screen.orientation?.lock?.('landscape');}catch{}
      }
    }catch{this.toast('Không thể bật toàn màn hình trên trình duyệt này');}
    this.syncFullscreen();this.game.resize();
  }
  show(state){const g=this.game;$('menu').hidden=state!=='menu';$('hud').hidden=state==='menu';$('overlay').hidden=state==='playing'||state==='menu';$('touch-controls').hidden=state!=='playing';document.body.classList.toggle('playing',state==='playing'||state==='paused'||state==='over');document.body.dataset.state=state;document.querySelector('.dialog').scrollTop=0;$('results').hidden=state!=='over';$('resume').hidden=state==='over';$('restart').hidden=state!=='over';$('dialog-title').innerHTML=state==='over'?'Hết giáp rồi<span>.</span>':'Tạm dừng<span>.</span>';$('dialog-eyebrow').textContent=state==='over'?(g.newBest?'KỶ LỤC MỚI!':'MỘT TRẬN CHIẾN ĐÁNG NHỚ'):'HÍT THỞ MỘT CHÚT';$('dialog-description').textContent=state==='over'?(g.newBest?'Bạn vừa vượt qua chính mình. Thử giữ thành tích lâu hơn nữa nhé!':'Thành phố vẫn ở đây. Sẵn sàng cho lần tiếp theo?'):'Thành phố có thể đợi bạn.';$('menu-best').textContent=String(g.best).padStart(6,'0');if(state==='paused')$('resume').focus();if(state==='over'){$('final-score').textContent=Math.floor(g.score).toLocaleString('vi-VN');$('final-best').textContent=g.best.toLocaleString('vi-VN');$('final-time').textContent=formatTime(g.time);$('final-kills').textContent=g.kills;$('final-combo').textContent=`×${g.maxCombo}`;$('restart').focus();}}
  toast(text){$('toast').textContent=text;$('toast').classList.add('visible');this.toastLife=3;}
  hit(){this.hitLife=.18;$('hit-flash').classList.add('active');}
  update(dt){const g=this.game,p=g.player;this.toastLife-=dt;this.hitLife-=dt;if(this.toastLife<=0)$('toast').classList.remove('visible');if(this.hitLife<=0)$('hit-flash').classList.remove('active');
    const hp=Math.round(Math.max(0,p.hp/CONFIG.player.hp)*100),stamina=Math.round(p.stamina/CONFIG.player.stamina*100);$('hp-value').textContent=Math.ceil(p.hp);$('hp-ring').style.setProperty('--angle',`${hp*3.6}deg`);$('stamina-value').textContent=Math.floor(p.stamina);$('stamina-ring').style.setProperty('--angle',`${stamina*3.6}deg`);const dashReady=p.stamina>=CONFIG.player.dashCost&&p.dashCooldown<=0;$('dash-button').disabled=!dashReady;$('dash-button').classList.toggle('ready',dashReady);$('score').textContent=String(Math.floor(g.score)).padStart(6,'0');$('combo').textContent=`×${Math.max(1,g.combo)}`;$('time').textContent=formatTime(g.time);
    const elite=g.enemies.list.find(e=>e.type==='elite');$('elite').hidden=!elite;if(elite){const value=Math.round(Math.max(0,elite.hp/elite.maxHP)*100);$('elite-ring').style.setProperty('--angle',`${value*3.6}deg`);$('elite-value').textContent=`${value}%`;}
    const phaseRemaining=CONFIG.world.phaseDuration-g.time%CONFIG.world.phaseDuration;$('day-icon').textContent=g.isNight?'☾':'☀';$('day-label').textContent=g.isNight?'ĐÊM ZOMBIE':'BAN NGÀY';$('day-timer').textContent=formatTime(Math.ceil(phaseRemaining));$('day-cycle').classList.toggle('is-night',g.isNight);
    $('world-status').textContent=g.world.pending?'SẮP ĐỔI':'TÁI CẤU TRÚC';$('shift-timer').textContent=formatTime(Math.ceil(g.world.pending?.remaining??g.world.nextShift));
    const i=g.input;$('crosshair').hidden=!i.pointerKnown||i.touchCapable;if(i.pointerKnown&&!i.touchCapable){$('crosshair').style.left=`${i.clientX}px`;$('crosshair').style.top=`${i.clientY}px`;}
  }
  clear(){this.toastLife=this.hitLife=0;$('toast').classList.remove('visible');$('hit-flash').classList.remove('active');}
}
