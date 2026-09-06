// Web Audio API Synthesized Chime & Optional Speech Announcement

export function playMandiChime(): void {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a friendly 2-tone airport / PA announcement chime
    const now = ctx.currentTime;
    
    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Note 2: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.25);
    gain2.gain.setValueAtTime(0.2, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.7);
  } catch (e) {
    console.debug('Audio chime skipped:', e);
  }
}

export function announceTokenSpeech(tokenNumber: string, counterNumber: string = 'Counter 2'): void {
  playMandiChime();
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // clear previous queue
      const text = `Attention please. Token ${tokenNumber.split('').join(' ')}, please proceed to ${counterNumber}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
    } catch (e) {
      console.debug('Speech synthesis skipped:', e);
    }
  }
}
