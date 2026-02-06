import type { Sentence } from '../../domain/entities/Sentence';

interface SentenceDisplayProps {
  sentence: Sentence | undefined;
  currentChunkIndex: number;
  currentInput: string;
  completedPatterns: string[];
}

export function SentenceDisplay({
  sentence,
  currentChunkIndex,
  currentInput,
  completedPatterns,
}: SentenceDisplayProps) {
  if (!sentence) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-500">
        全文完了
      </div>
    );
  }

  let completedRomaji = '';
  let currentRomaji = '';
  let remainingRomaji = '';

  for (let i = 0; i < sentence.chunks.length; i++) {
    const chunk = sentence.chunks[i]!;

    if (i < currentChunkIndex) {
      completedRomaji += completedPatterns[i] ?? chunk.inputPatterns[0]!;
    } else if (i === currentChunkIndex) {
      currentRomaji =
        chunk.inputPatterns.find((p) => p.startsWith(currentInput)) ??
        chunk.inputPatterns[0]!;
    } else {
      remainingRomaji += chunk.inputPatterns[0]!;
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
