import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  eventName?: string;
  variant?: 'gold' | 'terracotta' | 'compact';
  passedMessage?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  eventName,
  variant = 'gold',
  passedMessage = 'VOTING POLLS ARE CURRENTLY SEALED'
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasPassed: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, hasPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.hasPassed) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8471C]/20 border border-[#E8471C] text-[#FAF8F4] text-xs font-semibold rounded-md">
        <span className="w-2 h-2 rounded-full bg-[#E8471C] animate-ping" />
        {passedMessage}
      </div>
    );
  }

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds }
  ];

  const borderClass = variant === 'terracotta'
    ? 'border-[#E8471C]/60 group-hover:border-[#E8471C]'
    : 'border-[#C9971C]/40 group-hover:border-[#F2A01F]';

  const labelColor = variant === 'terracotta' ? 'text-[#E8471C]' : 'text-[#F2A01F]';

  return (
    <div className="inline-flex flex-col items-start sm:items-center">
      {eventName && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300 mb-1.5 block">
          {eventName}
        </span>
      )}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className={`flex flex-col items-center justify-center bg-[#0B0B0B]/85 backdrop-blur-md border ${borderClass} rounded-lg py-2 px-2 sm:px-3.5 min-w-[58px] sm:min-w-[72px] shadow-md transition-all`}
          >
            <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#FAF8F4] tabular-nums font-mono">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider ${labelColor} font-semibold mt-0.5`}>
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
