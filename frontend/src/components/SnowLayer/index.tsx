import { useEffect, useRef } from 'react';
import { createSnowAnimation } from '@/utils/animation';
import type { SnowAnimation } from '@/utils/animation';

/**
 * Full-screen snow particle layer.
 * - Snowballs of random size fall continuously in the background.
 * - Snowballs within the mouse hover radius are connected to the cursor with lines.
 * Renders a fixed-position div (z-index: 0, pointer-events: none) covering the viewport.
 */
const SnowLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<SnowAnimation | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animRef.current = createSnowAnimation(containerRef.current, {
      count: 120,
      baseSize: 5,       // 雪球基础半径（像图中那样稍大）
      speed: 1.0,
      color: '#ffffff',
      opacity: 0.85,
      grabDistance: 150,
      grabLineOpacity: 0.7,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="snow-layer"
      className="snow-layer"
      aria-hidden="true"
    />
  );
};

export default SnowLayer;
