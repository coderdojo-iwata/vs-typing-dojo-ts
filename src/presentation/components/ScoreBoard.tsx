interface ScoreBoardProps {
  playerLabel: string;
  score: number;
}

export function ScoreBoard({ playerLabel, score }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-lg font-bold text-white">{playerLabel}</span>
      <span className="text-lg font-bold text-yellow-400">Score: {score}</span>
    </div>
  );
}
