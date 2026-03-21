import { create } from "zustand";

export type TerminalPanelViewId =
  | "terminal"
  | "output"
  | "problems"
  | "console"
  | "ports";

const DEFAULT_VIEWS: TerminalPanelViewId[] = [
  "terminal",
  "output",
  "problems",
  "console",
  "ports",
];

interface TerminalPanelViewState {
  activeViewId: TerminalPanelViewId;
  visibleViews: TerminalPanelViewId[];
  setActiveViewId: (id: TerminalPanelViewId) => void;
  toggleViewVisibility: (id: TerminalPanelViewId) => void;
  ensureViewVisible: (id: TerminalPanelViewId) => void;
  showOutput: () => void;
  showProblems: () => void;
  reset: () => void;
}

export const useTerminalPanelViewStore = create<TerminalPanelViewState>(
  (set) => ({
    activeViewId: "terminal",
    visibleViews: DEFAULT_VIEWS,
    setActiveViewId: (id) => set({ activeViewId: id }),
    toggleViewVisibility: (id) =>
      set((state) => {
        const isVisible = state.visibleViews.includes(id);
        if (isVisible) {
          if (state.visibleViews.length === 1) return state;
          const visibleViews = state.visibleViews.filter((viewId) => viewId !== id);
          const activeViewId = visibleViews.includes(state.activeViewId)
            ? state.activeViewId
            : visibleViews[0] ?? "terminal";
          return { visibleViews, activeViewId };
        }

        const next = [...state.visibleViews, id];
        return {
          visibleViews: DEFAULT_VIEWS.filter((viewId) => next.includes(viewId)),
        };
      }),
    ensureViewVisible: (id) =>
      set((state) => {
        if (state.visibleViews.includes(id)) return state;
        const next = [...state.visibleViews, id];
        return {
          visibleViews: DEFAULT_VIEWS.filter((viewId) => next.includes(viewId)),
        };
      }),
    showOutput: () =>
      set((state) => {
        const visibleViews = state.visibleViews.includes("output")
          ? state.visibleViews
          : DEFAULT_VIEWS.filter((viewId) => [...state.visibleViews, "output"].includes(viewId));
        return { visibleViews, activeViewId: "output" };
      }),
    showProblems: () =>
      set((state) => {
        const visibleViews = state.visibleViews.includes("problems")
          ? state.visibleViews
          : DEFAULT_VIEWS.filter((viewId) => [...state.visibleViews, "problems"].includes(viewId));
        return { visibleViews, activeViewId: "problems" };
      }),
    reset: () =>
      set({
        activeViewId: "terminal",
        visibleViews: DEFAULT_VIEWS,
      }),
  }),
);
