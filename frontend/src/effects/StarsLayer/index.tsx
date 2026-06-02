import { useEffect, useRef } from "react";
import { createStarsAnimation } from "@/utils/animation";
import type { StarsAnimation } from "@/utils/animation";

const StarsLayer: React.FC = () => {
  const animRef = useRef<StarsAnimation | null>(null);

  useEffect(() => {
    animRef.current = createStarsAnimation({
      count: 760,
      maxRadius: 3.4,
      color: "#6ef06e",
      speed: 0.06,
      linkDistance: 86,
      lineOpacity: 0.16,
      lineWidth: 0.75,
      maxLinksPerStar: 2,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return null;
};

export default StarsLayer;
