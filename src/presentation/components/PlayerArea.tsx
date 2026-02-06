import type { Player } from '../../domain/entities/Player';
import type { Sentence } from '../../domain/entities/Sentence';
import { ScoreBoard } from './ScoreBoard';
import { SentenceDisplay } from './SentenceDisplay';

interface PlayerAreaProps {
  player: Player;
  sentences: Sentence[];
  label: string;
}

export function PlayerArea({ player, sentences, label }: PlayerAreaProps) {
  const currentSentence = sentences[player.currentSentenceIndex];

  return (
    <div className="p-4">
      <ScoreBoard playerLabel={label} score={player.score} />
      <SentenceDisplay
        sentence={currentSentence}
        currentChunkIndex={player.currentChunkIndex}
        currentInput={player.currentInput}
      />
    </div>
  );
}
