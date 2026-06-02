import { useEffect, useRef } from "react";
import { createStarsAnimation } from "@/utils/animation";
import type { StarsAnimation } from "@/utils/animation";

const StarsLayer: React.FC = () => {
  const animRef = useRef<StarsAnimation | null>(null);

  useEffect(() => {
    animRef.current = createStarsAnimation({
      count: 620,
      maxRadius: 3.1,
      color: "#6ef06e",
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
