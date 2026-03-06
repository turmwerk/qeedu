import { useEffect, useRef } from "react";
import { createSnowAnimation } from "@/utils/animation";
import type { SnowAnimation } from "@/utils/animation";

const SnowLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<SnowAnimation | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animRef.current = createSnowAnimation(containerRef.current, {
      count: 120,
      baseSize: 5,
      speed: 1.0,
      color: "#ffffff",
      opacity: 0.85,
      grabDistance: 150,
      grabLineOpacity: 0.7,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return <div ref={containerRef} id="snow-layer" className="snow-layer" aria-hidden="true" />;
};

export default SnowLayer;