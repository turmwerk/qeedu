import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SidebarView } from "./constants";

interface SidebarViewContextValue {
  activeView: SidebarView | null;
  setActiveView: (view: SidebarView | null) => void;
  toggleView: (view: SidebarView) => void;
}

const SidebarViewContext = createContext<SidebarViewContextValue | null>(null);

export const useSidebarView = (): SidebarViewContextValue => {
  const ctx = useContext(SidebarViewContext);
  if (!ctx) {
    throw new Error("useSidebarView must be used within SidebarViewProvider");
  }
  return ctx;
};

export const SidebarViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeView, setActiveView] = useState<SidebarView | null>(
    SidebarView.EXPLORER,
  );

  const toggleView = useCallback((view: SidebarView) => {
    setActiveView((prev) => (prev === view ? null : view));
  }, []);

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      toggleView,
    }),
    [activeView, toggleView],
  );

  return <SidebarViewContext.Provider value={value}>{children}</SidebarViewContext.Provider>;
};

export default SidebarViewProvider;
