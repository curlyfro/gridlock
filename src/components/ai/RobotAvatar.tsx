import { useMemo } from 'react';

type RobotMood = 'idle' | 'thinking' | 'happy' | 'angry' | 'panicked';

interface RobotAvatarProps {
  mood: RobotMood;
  size?: number;
}

export function RobotAvatar({ mood, size = 64 }: RobotAvatarProps) {
  const face = useMemo(() => {
    switch (mood) {
      case 'thinking': return { eyes: '. .', mouth: '---', eyeAnim: 'blink' };
      case 'happy': return { eyes: '^ ^', mouth: '\\___/', eyeAnim: '' };
      case 'angry': return { eyes: '> <', mouth: '/---\\', eyeAnim: '' };
      case 'panicked': return { eyes: 'O O', mouth: '~~~~', eyeAnim: 'shake' };
      default: return { eyes: 'o o', mouth: '---', eyeAnim: '' };
    }
  }, [mood]);

  return (
    <div className={`robot-avatar ${mood} ${face.eyeAnim}`} style={{ width: size, height: size }}>
      <div className="robot-head">
        <div className="robot-antenna" />
        <div className="robot-screen">
          <div className="robot-eyes">{face.eyes}</div>
          <div className="robot-mouth">{face.mouth}</div>
        </div>
      </div>
    </div>
  );
}
