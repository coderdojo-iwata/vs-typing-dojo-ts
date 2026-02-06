export interface Player {
  readonly id: 1 | 2;
  readonly score: number;
  readonly currentSentenceIndex: number;
  readonly currentChunkIndex: number;
  readonly currentInput: string;
}

export function createPlayer(id: 1 | 2): Player {
  return {
    id,
    score: 0,
    currentSentenceIndex: 0,
    currentChunkIndex: 0,
    currentInput: '',
  };
}

export function addScore(player: Player, points: number): Player {
  return { ...player, score: player.score + points };
}

export function nextChunk(player: Player): Player {
  return {
    ...player,
    currentChunkIndex: player.currentChunkIndex + 1,
    currentInput: '',
  };
}

export function nextSentence(player: Player): Player {
  return {
    ...player,
    currentSentenceIndex: player.currentSentenceIndex + 1,
    currentChunkIndex: 0,
    currentInput: '',
  };
}

export function resetInput(player: Player): Player {
  return { ...player, currentInput: '' };
}
