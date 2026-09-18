import { musicSamples } from './music.js';

export class Audio {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.active = 0;
    this.scene = 'menu';
    this.musicVoice = null;
    this.musicCache = new Map();
    this.lastEnemyShot = -Infinity;
  }

  unlock() {
    try {
      if (!this.context) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        const c = this.context = new Context();
        this.master = c.createGain();
        this.musicBus = c.createGain();
        this.effectsBus = c.createGain();
        this.musicBus.gain.value = .23;
        this.effectsBus.gain.value = .8;
        this.musicBus.connect(this.master);
        this.effectsBus.connect(this.master);
        this.master.connect(c.destination);
        this.makeNoise();
        this.makeShot();
      }
      this.update();
      if (this.context.state === 'suspended') this.context.resume().then(() => this.syncMusic()).catch(() => {});
      else this.syncMusic();
    } catch {}
  }

  update() {
    if (this.master) this.master.gain.value = this.settings.mute ? 0 : this.settings.volume;
  }

  makeNoise() {
    const c = this.context, length = Math.round(c.sampleRate * .6);
    const buffer = c.createBuffer(1, length, c.sampleRate), data = buffer.getChannelData(0);
    let seed = 0x654a21;
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[i] = seed / 2147483648 - 1;
    }
    this.noiseBuffer = buffer;
  }

  makeShot() {
    const c = this.context, rate = c.sampleRate, length = Math.round(rate * .42);
    const buffer = c.createBuffer(1, length, rate), data = buffer.getChannelData(0);
    const noise = this.noiseBuffer.getChannelData(0);
    const crackAlpha = 1 - Math.exp(-2 * Math.PI * 1550 / rate);
    const bodyAlpha = 1 - Math.exp(-2 * Math.PI * 520 / rate);
    const tailAlpha = 1 - Math.exp(-2 * Math.PI * 360 / rate);
    let crackLow = 0, bodyLow = 0, tailLow = 0, phase = 0;
    for (let i = 0; i < length; i++) {
      const time = i / rate, raw = noise[i], delayed = noise[(i + 9001) % noise.length];
      crackLow += (raw - crackLow) * crackAlpha;
      bodyLow += (raw - bodyLow) * bodyAlpha;
      tailLow += (delayed - tailLow) * tailAlpha;
      phase += 2 * Math.PI * (48 + 107 * Math.exp(-time * 24)) / rate;
      const crack = (raw - crackLow) * Math.exp(-time * 55) * .58;
      const body = bodyLow * Math.exp(-time * 17) * .42;
      const thump = Math.sin(phase) * Math.exp(-time * 15) * .53;
      const echo = time > .055 ? tailLow * Math.exp(-(time - .055) * 11) * .16 : 0;
      const click = time > .095 ? (raw - crackLow) * Math.exp(-(time - .095) * 75) * .1 : 0;
      data[i] = (crack + body + thump + echo + click) * Math.min(1, time / .002);
    }
    const dry = data.slice(), delay = Math.round(rate * .074);
    for (let i = delay; i < length; i++) data[i] += dry[i - delay] * .11;
    let peak = 0;
    for (const value of data) peak = Math.max(peak, Math.abs(value));
    const scale = peak > .85 ? .85 / peak : 1;
    for (let i = 0; i < length; i++) data[i] *= scale * Math.min(1, (length - 1 - i) / 110);
    this.shotBuffer = buffer;
  }

  musicBuffer(track) {
    if (!this.musicCache.has(track)) {
      const { samples, sampleRate } = musicSamples(track);
      const buffer = this.context.createBuffer(1, samples.length, sampleRate);
      buffer.getChannelData(0).set(samples);
      this.musicCache.set(track, buffer);
    }
    return this.musicCache.get(track);
  }

  setScene(scene) {
    this.scene = scene;
    this.syncMusic();
  }

  syncMusic() {
    const c = this.context;
    if (!c || c.state !== 'running') return;
    const track = this.scene === 'playing' ? 'battle' : this.scene === 'menu' || this.scene === 'over' ? 'theme' : null;
    const target = this.scene === 'over' ? .5 : 1;
    const now = c.currentTime, old = this.musicVoice;
    if (old?.track === track) {
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setTargetAtTime(target, now, .12);
      return;
    }
    if (old) {
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setValueAtTime(old.gain.gain.value, now);
      old.gain.gain.linearRampToValueAtTime(0, now + .32);
      old.source.stop(now + .34);
      this.musicVoice = null;
    }
    if (!track) return;
    const source = c.createBufferSource(), gain = c.createGain();
    source.buffer = this.musicBuffer(track);
    source.loop = true;
    source.connect(gain);
    gain.connect(this.musicBus);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(target, now + .42);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start(now);
    this.musicVoice = { source, gain, track };
  }

  noise(at, duration, level, frequency, filterType = 'lowpass') {
    const c = this.context, source = c.createBufferSource(), filter = c.createBiquadFilter(), gain = c.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = filterType;
    filter.frequency.value = frequency;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.effectsBus);
    gain.gain.setValueAtTime(.0001, at);
    gain.gain.linearRampToValueAtTime(level, at + .003);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    const offset = Math.random() * Math.max(0, this.noiseBuffer.duration - duration - .01);
    source.start(at, offset, duration);
    return source;
  }

  tone(at, duration, from, to, level, type = 'sine') {
    const c = this.context, oscillator = c.createOscillator(), gain = c.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, at);
    oscillator.frequency.exponentialRampToValueAtTime(to, at + duration);
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(gain);
    gain.connect(this.effectsBus);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(at);
    oscillator.stop(at + duration);
    return oscillator;
  }

  shot(volume, enemy) {
    const c = this.context, source = c.createBufferSource(), gain = c.createGain();
    source.buffer = this.shotBuffer;
    source.playbackRate.value = enemy ? .84 + Math.random() * .12 : .96 + Math.random() * .08;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.effectsBus);
    source.onended = () => { source.disconnect(); gain.disconnect(); this.active--; };
    source.start();
  }

  play(name, distance = 0) {
    const c = this.context;
    if (!c || c.state !== 'running' || this.settings.mute || this.active >= 24) return;
    const now = c.currentTime;
    if (name === 'enemyShot') {
      if (now - this.lastEnemyShot < .12 || distance > 29) return;
      this.lastEnemyShot = now;
    }
    this.active++;
    let end;
    if (name === 'shot' || name === 'enemyShot') {
      const volume = name === 'shot' ? 1 : .4 * Math.max(.18, 1 - distance / 32);
      this.shot(volume, name === 'enemyShot');
      return;
    } else if (name === 'explosion') {
      this.noise(now, .22, .52, 1300);
      this.tone(now, .42, 105, 29, .58, 'sine');
      end = this.noise(now + .05, .5, .32, 300);
    } else {
      const presets = {
        hit: [160, 48, .16, 'sawtooth', .22],
        dash: [220, 700, .15, 'triangle', .22],
        pickup: [520, 1100, .22, 'sine', .18],
        warning: [600, 360, .3, 'triangle', .15]
      };
      const [from, to, duration, type, level] = presets[name] || presets.hit;
      end = this.tone(now, duration, from, to, level, type);
    }
    end.addEventListener('ended', () => { this.active--; }, { once: true });
  }
}
