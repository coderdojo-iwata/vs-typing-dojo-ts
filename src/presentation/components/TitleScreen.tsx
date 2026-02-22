import type { SentenceSource } from '../../shared/types';
import { useApiKey } from '../hooks/useApiKey';
import { ApiKeyInput } from './ApiKeyInput';
import { useState } from 'react';

interface TitleScreenProps {
  onStart: (source: SentenceSource, apiKey?: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TitleScreen({ onStart, soundEnabled, onToggleSound }: TitleScreenProps) {
  const [source, setSource] = useState<SentenceSource>('local');
  const { apiKey, saveApiKey, clearApiKey, hasApiKey } = useApiKey();

  const canStart = source === 'local' || hasApiKey;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-12 gaming-title">VS TypingDojo</h1>

      <div className="w-80 space-y-6 mb-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">出題ソース</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="source"
              checked={source === 'local'}
              onChange={() => setSource('local')}
              className="accent-blue-500"
            />
            <span>ローカル</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="source"
              checked={source === 'api'}
              onChange={() => setSource('api')}
              className="accent-blue-500"
            />
            <span>ChatGPT API</span>
          </label>
        </div>

        {source === 'api' && (
          <ApiKeyInput
            apiKey={apiKey}
            onSave={saveApiKey}
            onClear={clearApiKey}
          />
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-400">サウンド</p>
          <label className="flex items-center gap-2 cursor-pointer" onClick={onToggleSound}>
            <span className="text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
            <span>{soundEnabled ? 'ON' : 'OFF'}</span>
          </label>
        </div>
      </div>

      <button
        onClick={() =>
          onStart(source, source === 'api' ? apiKey : undefined)
        }
        disabled={!canStart}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold py-4 px-12 rounded-lg transition-colors"
      >
        対戦開始
      </button>

      <div className="mt-12 text-gray-400 text-center space-y-2">
        <p className="text-lg font-semibold text-gray-300">操作説明</p>
        <p>Player 1: Caps Lock OFF（小文字）で入力</p>
        <p>Player 2: Caps Lock ON（大文字）で入力</p>
      </div>
    </div>
  );
}
