interface CountdownProps {
  value: number;
}

export function Countdown({ value }: CountdownProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <span
        key={value}
        className="text-9xl font-bold text-white animate-countdown-shrink"
      >
        {value}
      </span>
    </div>
  );
}
