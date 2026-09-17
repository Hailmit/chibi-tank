export class Audio {
  constructor(settings){this.settings=settings;this.context=null;this.active=0;}
  unlock(){try{if(!this.context){this.context=new(window.AudioContext||window.webkitAudioContext)();this.master=this.context.createGain();this.master.connect(this.context.destination);}if(this.context.state==='suspended')this.context.resume().catch(()=>{});this.update();}catch{}}
  update(){if(this.master)this.master.gain.value=this.settings.mute?0:this.settings.volume*.3;}
  play(name){
    if(!this.context||this.context.state!=='running'||this.settings.mute||this.active>24)return;
    const presets={shot:[180,65,.09,'square'],hit:[120,40,.12,'sawtooth'],explosion:[85,18,.45,'sawtooth'],dash:[220,700,.15,'triangle'],pickup:[520,1100,.22,'sine'],warning:[600,360,.3,'triangle']};
    const [from,to,duration,type]=presets[name]||presets.hit,c=this.context,osc=c.createOscillator(),gain=c.createGain();
    osc.type=type;osc.frequency.setValueAtTime(from,c.currentTime);osc.frequency.exponentialRampToValueAtTime(to,c.currentTime+duration);
    gain.gain.setValueAtTime(.45,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);
    osc.connect(gain);gain.connect(this.master);osc.start();osc.stop(c.currentTime+duration);this.active++;
    osc.onended=()=>{osc.disconnect();gain.disconnect();this.active--;};
  }
}
