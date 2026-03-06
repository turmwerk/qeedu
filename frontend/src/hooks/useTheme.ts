import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type Theme,
} from "@/utils/theme/controller";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    const handleThemeChange = () => setTheme(getStoredTheme());
    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  return {
    theme,
    setTheme: (nextTheme: Theme) => {
      applyTheme(nextTheme);
      setTheme(nextTheme);
    },
    toggleTheme: () => {
      const nextTheme = toggleTheme();
      setTheme(nextTheme);
      return nextTheme;
    },
  };
}