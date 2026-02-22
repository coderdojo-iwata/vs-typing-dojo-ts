import { useEffect, useRef, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameScreen } from './GameScreen';
import type { SentenceSource } from '../../shared/types';

interface GameScreenWrapperProps {
  onTitle: () => void;
  source: SentenceSource;
  apiKey?: string;
  duration: number;
  soundEnabled: boolean;
}

export function GameScreenWrapper({
  onTitle,
  source,
  apiKey,
  duration,
  soundEnabled,
}: GameScreenWrapperProps) {
  const { startGame } = useGame();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(source === 'api');

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      setLoading(source === 'api');
      startGame(source, duration, apiKey)
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [startGame, source, apiKey]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <p className="text-red-400 text-lg mb-6">{error}</p>
        <button
          onClick={onTitle}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
        >
          タイトルへ戻る
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <p className="text-xl">出題文を生成中...</p>
      </div>
    );
  }

  return <GameScreen onTitle={onTitle} soundEnabled={soundEnabled} />;
}
