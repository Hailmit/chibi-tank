// Original, tiny procedural loops. They are rendered once into an AudioBuffer;
// playback uses one looping source instead of scheduling notes during combat.
const SAMPLE_RATE = 22050;
const TAU = Math.PI * 2;
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

export function musicSamples(track) {
  const battle = track === 'battle';
  const beat = 60 / (battle ? 136 : 112);
  const length = Math.round(16 * beat * SAMPLE_RATE);
  const samples = new Float32Array(length);
  let seed = battle ? 0x51b1e : 0x70a7;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const add = (index, value) => { samples[index % length] += value; };

  function note(at, beats, midi, level, voice) {
    if (midi == null) return;
    const start = Math.round(at * beat * SAMPLE_RATE);
    const held = beats * beat;
    const tail = voice === 'pad' ? .3 : voice === 'pluck' ? .18 : .1;
    const count = Math.round((held + tail) * SAMPLE_RATE);
    const hz = frequency(midi);
    for (let i = 0; i < count; i++) {
      const time = i / SAMPLE_RATE;
      const release = time <= held ? 1 : Math.max(0, 1 - (time - held) / tail);
      let envelope, wave;
      const phase = TAU * hz * time;
      if (voice === 'pad') {
        envelope = Math.min(1, time / .085) * release;
        wave = .58 * Math.sin(phase) + .24 * Math.sin(phase * 1.004) + .18 * Math.sin(phase * 2);
      } else if (voice === 'pluck') {
        envelope = Math.min(1, time / .005) * Math.exp(-time * 3.2) * release;
        wave = .7 * Math.sin(phase) + .23 * Math.sin(phase * 2) + .07 * Math.sin(phase * 3);
      } else if (voice === 'bass') {
        envelope = Math.min(1, time / .008) * Math.exp(-time * .85) * release;
        wave = .8 * Math.sin(phase) + .18 * Math.sin(phase * 2) + .07 * Math.sin(phase * 3);
      } else {
        envelope = Math.min(1, time / .012) * Math.exp(-time * .9) * release;
        wave = .64 * Math.sin(phase) + .25 * Math.sin(phase * 2) + .11 * Math.sin(phase * 3);
      }
      add(start + i, wave * envelope * level);
    }
  }

  function drum(at, kind, level) {
    const start = Math.round(at * beat * SAMPLE_RATE);
    const seconds = kind === 'kick' ? .31 : kind === 'snare' ? .2 : .075;
    const count = Math.round(seconds * SAMPLE_RATE);
    let phase = 0, previous = 0;
    for (let i = 0; i < count; i++) {
      const time = i / SAMPLE_RATE;
      const noise = random();
      let value;
      if (kind === 'kick') {
        phase += TAU * (50 + 100 * Math.exp(-time * 25)) / SAMPLE_RATE;
        value = Math.sin(phase) * Math.exp(-time * 14) + noise * .06 * Math.exp(-time * 90);
      } else if (kind === 'snare') {
        value = (noise - previous * .72) * Math.exp(-time * 23) + Math.sin(TAU * 185 * time) * .22 * Math.exp(-time * 22);
      } else {
        value = (noise - previous * .9) * Math.exp(-time * 65);
      }
      previous = noise;
      add(start + i, value * level);
    }
  }

  const chords = battle
    ? [[52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 51, 54]]
    : [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]];
  const melody = battle
    ? [76, 71, 67, 71, 76, 79, 76, 71, 74, 71, 67, 71, 74, 76, 74, 71,
       72, 67, 64, 67, 72, 76, 72, 67, 71, 75, 78, 75, 71, 66, 68, 71]
    : [74, null, 69, 65, 69, null, 72, 69, 70, null, 74, 72, 69, null, 65, 64,
       67, null, 72, 69, 67, null, 64, 67, 76, null, 73, 69, 73, null, 69, 64];

  for (let bar = 0; bar < 4; bar++) {
    const chord = chords[bar];
    for (const pitch of chord) note(bar * 4, 3.85, pitch, battle ? .055 : .085, 'pad');
    if (battle) {
      for (let eighth = 0; eighth < 8; eighth++) {
        const pitch = eighth % 4 === 3 ? chord[0] + 12 : chord[0] - 12;
        note(bar * 4 + eighth * .5, .43, pitch, .15, 'bass');
      }
    } else {
      note(bar * 4, 1.7, chord[0] - 12, .14, 'bass');
      note(bar * 4 + 2, 1.7, chord[0] - 12, .12, 'bass');
    }
  }
  for (let i = 0; i < melody.length; i++) {
    if (battle) note(i * .5, .43, melody[i], i % 4 === 0 ? .13 : .095, 'lead');
    else note(i * .5, .75, melody[i], .18, 'pluck');
  }
  for (let i = 0; i < 16; i++) {
    if (battle) {
      drum(i, 'kick', .24);
      if (i % 4 === 1 || i % 4 === 3) drum(i, 'snare', .13);
      drum(i, 'hat', .035);
      drum(i + .5, 'hat', .027);
    } else {
      if (i % 4 === 0 || i % 4 === 2) drum(i, 'kick', .075);
      if (i % 4 === 3) drum(i, 'hat', .025);
    }
  }

  // A quiet, wrapped delay gives the synthetic instruments a little room.
  const delay = Math.round(.19 * SAMPLE_RATE);
  const dry = samples.slice();
  for (let i = 0; i < length; i++) samples[(i + delay) % length] += dry[i] * (battle ? .1 : .16);
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = peak > .78 ? .78 / peak : 1;
  const edge = Math.round(.008 * SAMPLE_RATE);
  for (let i = 0; i < length; i++) {
    const fade = Math.min(1, i / edge, (length - 1 - i) / edge);
    samples[i] *= scale * fade;
  }
  return { samples, sampleRate: SAMPLE_RATE };
}
