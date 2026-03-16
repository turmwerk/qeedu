import { useEffect, useRef } from "react";
import { createStarsAnimation } from "@/utils/animation";
import type { StarsAnimation } from "@/utils/animation";

const StarsLayer: React.FC = () => {
  const animRef = useRef<StarsAnimation | null>(null);

  useEffect(() => {
    animRef.current = createStarsAnimation({
      count: 220,
      maxRadius: 1.6,
      color: "#b8c8e8",
      speed: 0.06,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return null;
};

export default StarsLayer;