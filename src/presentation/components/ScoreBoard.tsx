interface ScoreBoardProps {
  playerLabel: string;
  score: number;
}

export function ScoreBoard({ playerLabel, score }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <span className="text-xl font-bold text-white">{playerLabel}</span>
      <span className="text-xl font-bold text-yellow-400">Score: {score}</span>
    </div>
  );
}
