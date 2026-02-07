import type { Player } from '../../domain/entities/Player';
import { calcAccuracy, calcKpm } from '../../domain/services/StatsCalculator';

interface ResultModalProps {
  player1: Player;
  player2: Player;
  winner: Player | null;
  remainingTime: number;
  onRestart: () => void;
  onTitle: () => void;
}

function PlayerStats({
  player,
  label,
  remainingTime,
}: {
  player: Player;
  label: string;
  remainingTime: number;
}) {
  const accuracy = calcAccuracy(player);
  const kpm = calcKpm(player, remainingTime);

  return (
    <div className="text-left">
      <h3 className="text-lg font-bold mb-2">{label}</h3>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">スコア</td>
            <td className="text-right font-mono">{player.score} 点</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">完了文数</td>
            <td className="text-right font-mono">{player.currentSentenceIndex} 文</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">正タイプ数</td>
            <td className="text-right font-mono">{player.correctTypes}</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">ミスタイプ数</td>
            <td className="text-right font-mono">{player.missTypes}</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">成功率</td>
            <td className="text-right font-mono">{accuracy}%</td>
          </tr>
          <tr>
            <td className="text-gray-400 pr-4 py-0.5">KPM</td>
            <td className="text-right font-mono">{kpm}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ResultModal({
  player1,
  player2,
  winner,
  remainingTime,
  onRestart,
  onTitle,
}: ResultModalProps) {
  const resultText = winner
    ? `Player ${winner.id} の勝ち!`
    : '引き分け!';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 text-center text-white max-w-lg w-full mx-4">
        <h2 className="text-3xl font-bold mb-4">結果発表</h2>
        <p className="text-2xl font-bold mb-6 text-yellow-400">{resultText}</p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <PlayerStats player={player1} label="Player 1" remainingTime={remainingTime} />
          <PlayerStats player={player2} label="Player 2" remainingTime={remainingTime} />
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
