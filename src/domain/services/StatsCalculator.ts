import type { Player } from '../entities/Player';
import { GAME_CONFIG } from '../../shared/gameConfig';

export function calcAccuracy(player: Player): number {
  const total = player.correctTypes + player.missTypes;
  if (total === 0) return 0;
  return Math.round((player.correctTypes / total) * 1000) / 10;
}

export function calcKpm(player: Player, remainingTime: number): number {
  const elapsed = GAME_CONFIG.DURATION_SECONDS - remainingTime;
  if (elapsed === 0) return 0;
  return Math.round((player.correctTypes / elapsed) * 60);
}
