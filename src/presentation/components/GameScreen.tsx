import { useGame } from '../hooks/useGame';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { Timer } from './Timer';
import { PlayerArea } from './PlayerArea';
import { ResultModal } from './ResultModal';

interface GameScreenProps {
  onTitle: () => void;
}

export function GameScreen({ onTitle }: GameScreenProps) {
  const { game, dispatch, startGame, resetGame, winner } = useGame();

  useKeyboardInput(dispatch, game.state === 'playing');

  const handleRestart = async () => {
    resetGame();
    await startGame();
  };

  const handleTitle = () => {
    resetGame();
    onTitle();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {game.state === 'countdown' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <span className="text-8xl font-bold text-white animate-pulse">
            Ready...
          </span>
        </div>
      )}

      <Timer remainingTime={game.remainingTime} />

      <div className="flex-1 flex flex-col justify-center gap-4 px-4 max-w-4xl mx-auto w-full">
        <PlayerArea
          player={game.player1}
          sentences={game.sentences}
          label="Player 1"
        />
        <div className="border-t border-gray-700" />
        <PlayerArea
          player={game.player2}
          sentences={game.sentences}
          label="Player 2"
        />
      </div>

      {game.state === 'finished' && (
        <ResultModal
          player1={game.player1}
          player2={game.player2}
          winner={winner}
          onRestart={handleRestart}
          onTitle={handleTitle}
        />
      )}
    </div>
  );
}
