export const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const playSingingBowlChime = (pitch = 180) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Non-harmonic overtones for a rich Tibetan singing bowl sound:
    const frequencies = [pitch, pitch * 2, pitch * 2.76, pitch * 3.2, pitch * 5.4];
    const gains = [0.5, 0.25, 0.15, 0.1, 0.05];

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.0);

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      if (index > 0) {
        osc.frequency.setValueAtTime(freq + Math.sin(index) * 1.5, ctx.currentTime);
      }

      oscGain.gain.setValueAtTime(gains[index], ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0 - index * 0.4);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 5.0);
    });
  } catch (e) {
    console.warn("Could not play singing bowl chime:", e);
  }
};
