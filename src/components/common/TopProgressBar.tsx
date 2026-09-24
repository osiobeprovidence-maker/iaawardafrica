import React, { useState, useEffect, useCallback, useRef } from 'react';

// Custom event names for global loading triggers
export const TRIGGER_PROGRESS_START = 'iaa-progress-start';
export const TRIGGER_PROGRESS_COMPLETE = 'iaa-progress-complete';

/**
 * Global helper to trigger progress bar programmatically from anywhere (e.g. data fetching, search, filter)
 */
export const triggerTopProgress = (durationMs = 400) => {
  window.dispatchEvent(new CustomEvent(TRIGGER_PROGRESS_START));
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(TRIGGER_PROGRESS_COMPLETE));
  }, durationMs);
};

interface TopProgressBarProps {
  /**
   * Automatically trigger animation when activeTab changes
   */
  activeTab?: string;
  /**
   * Optional manual loading state
   */
  isLoading?: boolean;
}

export const TopProgressBar: React.FC<TopProgressBarProps> = ({ activeTab, isLoading }) => {
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timeoutRef.current.forEach(t => clearTimeout(t));
    timeoutRef.current = [];
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startProgress = useCallback(() => {
    clearAllTimers();
    setVisible(true);
    setProgress(15);

    // Increment progression simulating network & render work
    const t1 = setTimeout(() => {
      setProgress(45);
    }, 60);

    const t2 = setTimeout(() => {
      setProgress(78);
    }, 180);

    const t3 = setTimeout(() => {
      setProgress(90);
    }, 350);

    timeoutRef.current.push(t1, t2, t3);
  }, []);

  const completeProgress = useCallback(() => {
    clearAllTimers();
    setProgress(100);

    const tFinish = setTimeout(() => {
      setVisible(false);
      const tReset = setTimeout(() => {
        setProgress(0);
      }, 200);
      timeoutRef.current.push(tReset);
    }, 250);

    timeoutRef.current.push(tFinish);
  }, []);

  // Trigger on activeTab transition
  useEffect(() => {
    if (activeTab !== undefined) {
      startProgress();
      const finishTimer = setTimeout(() => {
        completeProgress();
      }, 280);
      timeoutRef.current.push(finishTimer);
    }
  }, [activeTab, startProgress, completeProgress]);

  // Trigger on manual isLoading prop
  useEffect(() => {
    if (isLoading) {
      startProgress();
    } else if (visible && progress > 0) {
      completeProgress();
    }
  }, [isLoading, startProgress, completeProgress]);

  // Listen for global custom events
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleComplete = () => completeProgress();

    window.addEventListener(TRIGGER_PROGRESS_START, handleStart);
    window.addEventListener(TRIGGER_PROGRESS_COMPLETE, handleComplete);

    return () => {
      window.removeEventListener(TRIGGER_PROGRESS_START, handleStart);
      window.removeEventListener(TRIGGER_PROGRESS_COMPLETE, handleComplete);
      clearAllTimers();
    };
  }, [startProgress, completeProgress]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] h-[3.5px] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading indicator"
    >
      {/* Background track (ultra subtle) */}
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />

      {/* Dynamic Animated Progress Bar */}
      <div
        className="h-full bg-gradient-to-r from-[#C9971C] via-[#E8471C] to-[#F2A01F] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: progress === 100 ? 'width 150ms ease-out, opacity 250ms ease-out' : 'width 250ms cubic-bezier(0.1, 0.5, 0.1, 1)'
        }}
      >
        {/* Leading Glow Flare */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-6 bg-gradient-to-r from-transparent via-[#E8471C]/80 to-white rounded-full blur-xs shadow-[0_0_12px_#E8471C,0_0_6px_#C9971C]"
          style={{ opacity: progress < 100 ? 1 : 0 }}
        />

        {/* Subtle shimmer sheen */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  );
};
