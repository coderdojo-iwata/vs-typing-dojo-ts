import { useState } from 'react';

const STORAGE_KEY = 'vs-typing-dojo-openai-api-key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? ''
  );

  const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
  };

  return { apiKey, saveApiKey, clearApiKey, hasApiKey: apiKey !== '' };
}
