import type { Player } from './Player';
import { createPlayer } from './Player';
import type { Sentence } from './Sentence';
import { GAME_CONFIG } from '../../shared/gameConfig';

export type GameState = 'idle' | 'countdown' | 'playing' | 'finished';

export interface Game {
  readonly state: GameState;
  readonly player1: Player;
  readonly player2: Player;
  readonly remainingTime: number;
  readonly sentences: Sentence[];
}

export function createGame(sentences: Sentence[]): Game {
  return {
    state: 'idle',
    player1: createPlayer(1),
    player2: createPlayer(2),
    remainingTime: GAME_CONFIG.DURATION_SECONDS,
    sentences,
  };
}

export function startCountdown(game: Game): Game {
  return { ...game, state: 'countdown' };
}

export function startPlaying(game: Game): Game {
  return { ...game, state: 'playing' };
}

export function tickGame(game: Game): Game {
  const next = Math.max(0, game.remainingTime - 1);
  return {
    ...game,
    remainingTime: next,
    state: next === 0 ? 'finished' : game.state,
  };
}

export function finish(game: Game): Game {
  return { ...game, state: 'finished' };
}

export function getWinner(game: Game): Player | null {
  if (game.player1.score > game.player2.score) return game.player1;
  if (game.player2.score > game.player1.score) return game.player2;
  return null;
}
