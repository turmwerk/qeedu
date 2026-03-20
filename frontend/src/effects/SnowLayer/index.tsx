import { useEffect, useRef, useState } from "react";
import { createSnowAnimation } from "@/utils/animation";
import type { SnowAnimation } from "@/utils/animation";
import { getEffectsEnabled } from "@/utils/effects/controller";

const SnowLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<SnowAnimation | null>(null);
  const [enabled, setEnabled] = useState(() => getEffectsEnabled());

  useEffect(() => {
    const handleEffectsChange = () => setEnabled(getEffectsEnabled());

    window.addEventListener("effects-change", handleEffectsChange);
    window.addEventListener("storage", handleEffectsChange);

    return () => {
      window.removeEventListener("effects-change", handleEffectsChange);
      window.removeEventListener("storage", handleEffectsChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      animRef.current?.destroy();
      animRef.current = null;
      return;
    }

    animRef.current?.destroy();
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
  }, [enabled]);

  return <div ref={containerRef} id="snow-layer" className="snow-layer" aria-hidden="true" />;
};

export default SnowLayer;
