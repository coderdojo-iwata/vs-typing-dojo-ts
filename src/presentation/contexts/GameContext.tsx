import { createContext, useReducer, useState, type ReactNode } from 'react';
import type { Game } from '../../domain/entities/Game';
import { createGame } from '../../domain/entities/Game';
import { gameReducer, type GameAction } from './gameReducer';

export interface GameContextValue {
  game: Game;
  dispatch: React.Dispatch<GameAction>;
  countdownValue: number | null;
  setCountdownValue: React.Dispatch<React.SetStateAction<number | null>>;
}

const GameContext = createContext<GameContextValue | null>(null);

export { GameContext };
export type { GameAction };

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, dispatch] = useReducer(gameReducer, createGame([]));
  const [countdownValue, setCountdownValue] = useState<number | null>(null);

  return (
    <GameContext.Provider value={{ game, dispatch, countdownValue, setCountdownValue }}>
      {children}
    </GameContext.Provider>
  );
}
