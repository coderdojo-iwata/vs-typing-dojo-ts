interface TimerProps {
  remainingTime: number;
}

export function Timer({ remainingTime }: TimerProps) {
  return (
    <div className="text-center py-4">
      <span className="text-3xl font-bold text-white">
        残り時間: {remainingTime}秒
      </span>
    </div>
  );
}
