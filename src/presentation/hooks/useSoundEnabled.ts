import { useState, useCallback } from 'react';

const STORAGE_KEY = 'soundEnabled';

function loadSoundEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

export function useSoundEnabled() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundEnabled);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound };
}
