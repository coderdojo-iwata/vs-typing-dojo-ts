import type { Player } from '../../domain/entities/Player';

interface ResultModalProps {
  player1: Player;
  player2: Player;
  winner: Player | null;
  onRestart: () => void;
  onTitle: () => void;
}

export function ResultModal({
  player1,
  player2,
  winner,
  onRestart,
  onTitle,
}: ResultModalProps) {
  const resultText = winner
    ? `Player ${winner.id} の勝ち!`
    : '引き分け!';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 text-center text-white max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold mb-6">結果発表</h2>
        <p className="text-2xl font-bold mb-8 text-yellow-400">{resultText}</p>

        <div className="space-y-2 mb-8 text-lg">
          <p>Player 1: {player1.score} 点</p>
          <p>Player 2: {player2.score} 点</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            もう一度対戦
          </button>
          <button
            onClick={onTitle}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            タイトルへ
          </button>
        </div>
      </div>
    </div>
  );
}
