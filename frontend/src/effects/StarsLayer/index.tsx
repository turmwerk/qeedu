import { useEffect, useRef } from "react";
import { createStarsAnimation } from "@/utils/animation";
import type { StarsAnimation } from "@/utils/animation";
import { clearStarsCanvases, getStoredTheme } from "@/utils/theme/controller";

const StarsLayer: React.FC = () => {
  const animRef = useRef<StarsAnimation | null>(null);

  useEffect(() => {
    const destroyStars = () => {
      animRef.current?.destroy();
      animRef.current = null;
      clearStarsCanvases();
    };

    const createStars = () => {
      destroyStars();
      animRef.current = createStarsAnimation({
        count: 760,
        maxRadius: 3.4,
        color: "#6ef06e",
        speed: 0.06,
        linkDistance: 96,
        lineOpacity: 0.2,
        lineWidth: 0.85,
        maxLinksPerStar: 2,
      });
    };

    if (getStoredTheme() === "dark") {
      createStars();
    } else {
      clearStarsCanvases();
    }

    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<{ theme?: string }>).detail?.theme ?? getStoredTheme();
      if (nextTheme === "dark") {
        createStars();
      } else {
        destroyStars();
      }
    };

    window.addEventListener("theme-change", handleThemeChange as EventListener);
    window.addEventListener("storage", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange as EventListener);
      window.removeEventListener("storage", handleThemeChange as EventListener);
      destroyStars();
    };
  }, []);

  return null;
};

export default StarsLayer;
