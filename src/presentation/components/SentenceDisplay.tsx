import type { Sentence } from '../../domain/entities/Sentence';

interface SentenceDisplayProps {
  sentence: Sentence | undefined;
  currentChunkIndex: number;
  currentInput: string;
}

export function SentenceDisplay({
  sentence,
  currentChunkIndex,
  currentInput,
}: SentenceDisplayProps) {
  if (!sentence) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-500">
        全文完了
      </div>
    );
  }

  // ローマ字の入力済み部分と未入力部分を計算
  let completedRomaji = '';
  let currentRomaji = '';
  let remainingRomaji = '';

  for (let i = 0; i < sentence.chunks.length; i++) {
    const chunk = sentence.chunks[i]!;
    const displayRomaji = chunk.inputPatterns[0]!;

    if (i < currentChunkIndex) {
      completedRomaji += displayRomaji;
    } else if (i === currentChunkIndex) {
      currentRomaji = displayRomaji;
    } else {
      remainingRomaji += displayRomaji;
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-xl text-white mb-2">{sentence.japanese}</p>
      <p className="font-mono text-lg">
        <span className="text-green-400">{completedRomaji}</span>
        <span className="text-green-400">{currentInput}</span>
        <span className="text-yellow-300 underline">
          {currentRomaji.slice(currentInput.length)}
        </span>
        <span className="text-gray-400">{remainingRomaji}</span>
      </p>
    </div>
  );
}
