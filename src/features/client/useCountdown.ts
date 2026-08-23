import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  onComplete?: () => void;
}

export function useCountdown(
  seconds: number,
  { onComplete }: UseCountdownOptions = {}
) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);
  const endAtRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (endAtRef.current === null) {
      endAtRef.current = Date.now() + seconds * 1000;
    }
    if (!isRunning) return;

    const tick = () => {
      const endAt = endAtRef.current ?? Date.now();
      const secondsLeft = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(secondsLeft);
      if (secondsLeft === 0) {
        setIsRunning(false);
        onCompleteRef.current?.();
      }
    };

    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => {
    endAtRef.current = Date.now() + remaining * 1000;
    setIsRunning(true);
  }, [remaining]);
  const skip = useCallback(() => {
    setIsRunning(false);
    setRemaining(0);
    onCompleteRef.current?.();
  }, []);

  return { remaining, isRunning, pause, resume, skip };
}
