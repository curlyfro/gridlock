import { useEffect, useState } from 'react';

interface ScreenShakeProps {
  trigger: number; // increment to trigger shake
  intensity?: number;
  children: React.ReactNode;
}

export function ScreenShake({ trigger, intensity = 4, children }: ScreenShakeProps) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (trigger <= 0) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 300);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div
      className={shaking ? 'screen-shake' : ''}
      style={{
        ['--shake-intensity' as string]: `${intensity}px`,
      }}
    >
      {children}
    </div>
  );
}
