import { useEffect, useRef } from 'react';
import type { LastValidation } from '../../domain/entities/Game';

function playBeep(ctx: AudioContext, frequency: number, duration: number, startTime: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.25, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playSound(ctx: AudioContext, lastValidation: LastValidation) {
  const now = ctx.currentTime;
  const { result, sentenceCompleted, noMiss } = lastValidation;

  if (sentenceCompleted && noMiss) {
    // ノーミス完成: 3音上昇ファンファーレ
    playBeep(ctx, 660, 0.1, now);
    playBeep(ctx, 880, 0.1, now + 0.1);
    playBeep(ctx, 1100, 0.15, now + 0.2);
  } else if (sentenceCompleted) {
    // 文章完成（ミスあり）: 2音上昇
    playBeep(ctx, 660, 0.1, now);
    playBeep(ctx, 880, 0.12, now + 0.1);
  } else if (result === 'correct' || result === 'partial') {
    // 正しい入力: 短いビープ
    playBeep(ctx, 660, 0.06, now);
  } else {
    // 不正解: 下降ブザー
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  }
}

export function useSoundEffect(lastValidation: LastValidation | undefined, soundEnabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!lastValidation || !soundEnabled) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    playSound(ctx, lastValidation);
  }, [lastValidation, soundEnabled]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);
}
