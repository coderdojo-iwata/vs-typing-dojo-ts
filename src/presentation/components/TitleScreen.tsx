interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-12">タイピング道場</h1>

      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-lg transition-colors"
      >
        対戦開始
      </button>

      <div className="mt-12 text-gray-400 text-center space-y-2">
        <p className="text-lg font-semibold text-gray-300">操作説明</p>
        <p>Player 1: Caps Lock OFF（小文字）で入力</p>
        <p>Player 2: Caps Lock ON（大文字）で入力</p>
      </div>
    </div>
  );
}
