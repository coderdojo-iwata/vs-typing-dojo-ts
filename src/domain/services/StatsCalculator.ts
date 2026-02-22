import type { Player } from '../entities/Player';

export function calcAccuracy(player: Player): number {
  const total = player.correctTypes + player.missTypes;
  if (total === 0) return 0;
  return Math.round((player.correctTypes / total) * 1000) / 10;
}

export function calcKpm(player: Player, remainingTime: number, duration: number): number {
  const elapsed = duration - remainingTime;
  if (elapsed === 0) return 0;
  return Math.round((player.correctTypes / elapsed) * 60);
}
