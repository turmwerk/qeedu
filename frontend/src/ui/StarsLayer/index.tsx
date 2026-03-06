import { useEffect, useRef } from 'react';
import { createStarsAnimation } from '@/utils/animation';
import type { StarsAnimation } from '@/utils/animation';

/**
 * Full-screen star field for dark theme.
 * Tiny slowly-drifting dots, NO mouse connections, NO falling direction.
 * Completely independent from SnowLayer.
 * Only renders visually (pointer-events: none, z-index: 9997).
 */
const StarsLayer: React.FC = () => {
  const animRef = useRef<StarsAnimation | null>(null);

  useEffect(() => {
    animRef.current = createStarsAnimation({
      count: 220,
      maxRadius: 1.6,
      color: '#b8c8e8',
      speed: 0.06,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  // No visible DOM element needed – canvas is appended directly to body
  return null;
};

export default StarsLayer;
