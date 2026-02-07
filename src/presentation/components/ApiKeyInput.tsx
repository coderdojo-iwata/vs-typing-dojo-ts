import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ApiKeyInput({ apiKey, onSave, onClear }: ApiKeyInputProps) {
  const [input, setInput] = useState(apiKey);
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-400">API キー</label>
      <div className="flex items-center gap-2">
        <input
          type={visible ? 'text' : 'password'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="sk-..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setVisible(!visible)}
          className="text-gray-400 hover:text-white text-sm px-2 py-2"
          type="button"
        >
          {visible ? '隠す' : '表示'}
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(input)}
          disabled={input === ''}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-4 py-1 rounded transition-colors"
          type="button"
        >
          保存
        </button>
        <button
          onClick={() => {
            onClear();
            setInput('');
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-1 rounded transition-colors"
          type="button"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
