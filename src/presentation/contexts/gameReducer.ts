import type { Game } from '../../domain/entities/Game';
import {
  createGame,
  startCountdown,
  startPlaying,
  tickGame,
  finish,
} from '../../domain/entities/Game';
import { processInput } from '../../application/usecases/InputUseCase';
import type { Sentence } from '../../domain/entities/Sentence';

export type GameAction =
  | { type: 'INIT'; sentences: Sentence[] }
  | { type: 'START_COUNTDOWN' }
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'INPUT'; key: string }
  | { type: 'END_GAME' }
  | { type: 'RESET' };

export function gameReducer(state: Game, action: GameAction): Game {
  switch (action.type) {
    case 'INIT':
      return createGame(action.sentences);
    case 'START_COUNTDOWN':
      return startCountdown(state);
    case 'START_GAME':
      return startPlaying(state);
    case 'TICK': {
      return tickGame(state);
    }
    case 'INPUT': {
      if (state.state !== 'playing') return state;
      const { game } = processInput(state, action.key);
      return game;
    }
    case 'END_GAME':
      return finish(state);
    case 'RESET':
      return createGame(state.sentences);
    default:
      return state;
  }
}
