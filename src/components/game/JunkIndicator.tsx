import { useEffect, useState } from 'react';

interface JunkIndicatorProps {
  pendingJunk: number;
}

export function JunkIndicator({ pendingJunk }: JunkIndicatorProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (pendingJunk > 0) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [pendingJunk]);

  if (pendingJunk <= 0) return null;

  return (
    <div className={`junk-indicator ${flash ? 'flash' : ''}`}>
      <div className="junk-warning">INCOMING ATTACK!</div>
      <div className="junk-count">+{pendingJunk} rows</div>
    </div>
  );
}
