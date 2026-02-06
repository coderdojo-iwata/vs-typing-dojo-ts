import { createContext, useReducer, type ReactNode } from 'react';
import type { Game } from '../../domain/entities/Game';
import { createGame } from '../../domain/entities/Game';
import { gameReducer, type GameAction } from './gameReducer';

export interface GameContextValue {
  game: Game;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export { GameContext };
export type { GameAction };

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, dispatch] = useReducer(gameReducer, createGame([]));

  return (
    <GameContext.Provider value={{ game, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
