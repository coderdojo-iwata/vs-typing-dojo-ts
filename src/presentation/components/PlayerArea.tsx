import type { Player } from '../../domain/entities/Player';
import type { Sentence } from '../../domain/entities/Sentence';
import { ScoreBoard } from './ScoreBoard';
import { SentenceDisplay } from './SentenceDisplay';

interface PlayerAreaProps {
  player: Player;
  sentences: Sentence[];
  label: string;
  flash?: boolean;
  isPlaying: boolean;
}

export function PlayerArea({ player, sentences, label, flash, isPlaying }: PlayerAreaProps) {
  const currentSentence = sentences[player.currentSentenceIndex];

  return (
    <div
      className={`p-4 rounded-lg transition-colors duration-200 ${
        flash ? 'bg-red-900/50' : ''
      }`}
    >
      <ScoreBoard playerLabel={label} score={player.score} />
      {isPlaying ? (
        <SentenceDisplay
          sentence={currentSentence}
          currentChunkIndex={player.currentChunkIndex}
          currentInput={player.currentInput}
          completedPatterns={player.completedPatterns}
        />
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500 text-2xl">
          &nbsp;
        </div>
      )}
    </div>
  );
}
