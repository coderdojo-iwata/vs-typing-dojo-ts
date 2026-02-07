import type { Game } from '../../domain/entities/Game';
import type { Player } from '../../domain/entities/Player';
import {
  addScore,
  nextChunk,
  nextSentence,
  incrementCorrectTypes,
  incrementMissTypes,
} from '../../domain/entities/Player';
import {
  InputValidator,
  type ValidationResult,
} from '../../domain/services/InputValidator';
import { GAME_CONFIG } from '../../shared/gameConfig';

export interface InputResult {
  game: Game;
  validation: ValidationResult;
}

function getPlayerAndKey(
  game: Game,
  key: string
): { player: Player; playerId: 1 | 2; inputChar: string } | null {
  if (key >= 'a' && key <= 'z') {
    return { player: game.player1, playerId: 1, inputChar: key };
  }
  if (key >= 'A' && key <= 'Z') {
    return { player: game.player2, playerId: 2, inputChar: key.toLowerCase() };
  }
  return null;
}

export function processInput(game: Game, key: string): InputResult {
  const parsed = getPlayerAndKey(game, key);
  if (!parsed) {
    return { game, validation: 'incorrect' };
  }

  const { player, playerId, inputChar } = parsed;
  const sentence = game.sentences[player.currentSentenceIndex];
  if (!sentence) {
    return { game, validation: 'incorrect' };
  }

  const chunk = sentence.chunks[player.currentChunkIndex];
  if (!chunk) {
    return { game, validation: 'incorrect' };
  }

  const newInput = player.currentInput + inputChar;
  const validation = InputValidator.validate(newInput, chunk);

  let updatedPlayer: Player;

  if (validation === 'correct') {
    let scored = addScore(incrementCorrectTypes(player), 1);
    const isLastChunk = player.currentChunkIndex >= sentence.chunks.length - 1;
    if (isLastChunk) {
      if (!scored.hasMissedCurrentSentence) {
        scored = addScore(scored, GAME_CONFIG.NO_MISS_BONUS);
      }
      updatedPlayer = nextSentence(scored);
    } else {
      updatedPlayer = nextChunk(scored, newInput);
    }
  } else if (validation === 'partial') {
    updatedPlayer = { ...incrementCorrectTypes(player), currentInput: newInput };
  } else {
    const missed = incrementMissTypes(player);
    const updatedGame: Game =
      playerId === 1
        ? { ...game, player1: missed, lastValidation: { playerId, result: 'incorrect' } }
        : { ...game, player2: missed, lastValidation: { playerId, result: 'incorrect' } };
    return { game: updatedGame, validation: 'incorrect' };
  }

  let updatedGame: Game =
    playerId === 1
      ? { ...game, player1: updatedPlayer, lastValidation: { playerId, result: validation } }
      : { ...game, player2: updatedPlayer, lastValidation: { playerId, result: validation } };

  if (updatedPlayer.currentSentenceIndex >= game.sentences.length) {
    updatedGame = { ...updatedGame, state: 'finished' };
  }

  return { game: updatedGame, validation };
}
