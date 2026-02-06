import type { Game } from '../../domain/entities/Game';
import {
  createGame,
  startCountdown,
  startPlaying,
  tick as gameTick,
  finish,
} from '../../domain/entities/Game';
import type { SentenceRepository } from '../../domain/repositories/SentenceRepository';

export interface GameUseCase {
  getGame(): Game;
  startGame(): Promise<void>;
  startPlaying(): void;
  tick(): void;
  endGame(): void;
}

export function createGameUseCase(
  sentenceRepository: SentenceRepository
): GameUseCase {
  let game: Game = createGame([]);

  return {
    getGame() {
      return game;
    },

    async startGame() {
      const sentences = await sentenceRepository.getSentences();
      game = startCountdown(createGame(sentences));
    },

    startPlaying() {
      game = startPlaying(game);
    },

    tick() {
      game = gameTick(game);
    },

    endGame() {
      game = finish(game);
    },
  };
}
