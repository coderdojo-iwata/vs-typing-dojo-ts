import { useEffect, useRef, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { Timer } from './Timer';
import { PlayerArea } from './PlayerArea';
import { ResultModal } from './ResultModal';
import { Countdown } from './Countdown';
import { GAME_CONFIG } from '../../shared/gameConfig';

interface GameScreenProps {
  onTitle: () => void;
}

export function GameScreen({ onTitle }: GameScreenProps) {
  const { game, dispatch, restartGame, resetGame, countdownValue, winner } =
    useGame();
  const [flashPlayer1, setFlashPlayer1] = useState(false);
  const [flashPlayer2, setFlashPlayer2] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useKeyboardInput(dispatch, game.state === 'playing');

  useEffect(() => {
    if (!game.lastValidation) return;
    const { playerId, result } = game.lastValidation;
    if (result !== 'incorrect') return;

    const setFlash = playerId === 1 ? setFlashPlayer1 : setFlashPlayer2;
    setFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setFlash(false);
      flashTimerRef.current = null;
    }, GAME_CONFIG.FLASH_DURATION_MS);
  }, [game.lastValidation]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleRestart = () => {
    restartGame();
  };

  const handleTitle = () => {
    resetGame();
    onTitle();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {countdownValue !== null && <Countdown value={countdownValue} />}

      <div className="flex-1 flex flex-col justify-center gap-6 px-4 max-w-5xl mx-auto w-full">
        <Timer remainingTime={game.remainingTime} />
        <PlayerArea
          player={game.player1}
          sentences={game.sentences}
          label="Player 1"
          flash={flashPlayer1}
        />
        <div className="border-t border-gray-700" />
        <PlayerArea
          player={game.player2}
          sentences={game.sentences}
          label="Player 2"
          flash={flashPlayer2}
        />
      </div>

      {game.state === 'finished' && (
        <ResultModal
          player1={game.player1}
          player2={game.player2}
          winner={winner}
          remainingTime={game.remainingTime}
          onRestart={handleRestart}
          onTitle={handleTitle}
        />
      )}
    </div>
  );
}
