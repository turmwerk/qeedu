import { create } from "zustand";
import bashProfile from "./Bash";

export type TerminalProfile = typeof bashProfile;

export type TerminalSession = {
  id: string;
  title: string;
  profileId: TerminalProfile["id"];
};

export const terminalProfiles: TerminalProfile[] = [
  bashProfile,
];

const createSessionMeta = (
  profile: TerminalProfile,
  index: number,
): TerminalSession => {
  const seed = Math.random().toString(36).slice(2, 8);
  return {
    id: `${profile.id}-${Date.now()}-${seed}`,
    title: `${profile.title} ${index}`,
    profileId: profile.id,
  };
};

type TerminalSessionState = {
  sessions: TerminalSession[];
  activeId: string | null;
  selectedProfileId: TerminalProfile["id"];
  setActiveId: (id: string) => void;
  setSelectedProfileId: (id: TerminalProfile["id"]) => void;
  addSession: (profileId?: TerminalProfile["id"]) => TerminalSession;
  removeSession: (id: string) => void;
};

const initialSession = createSessionMeta(bashProfile, 1);

export const useTerminalSessionStore = create<TerminalSessionState>(
  (set, get) => ({
    sessions: [initialSession],
    activeId: initialSession.id,
    selectedProfileId: terminalProfiles[0]?.id ?? "bash",
    setActiveId: (id) => set({ activeId: id }),
    setSelectedProfileId: (id) => set({ selectedProfileId: id }),
    addSession: (profileId) => {
      const targetId = profileId ?? get().selectedProfileId;
      const targetProfile =
        terminalProfiles.find((profile) => profile.id === targetId) ??
        terminalProfiles[0];
      const count =
        get().sessions.filter((s) => s.profileId === targetProfile.id).length +
        1;
      const next = createSessionMeta(targetProfile, count);
      set((state) => ({
        sessions: [next, ...state.sessions],
        activeId: next.id,
      }));
      return next;
    },
    removeSession: (id) => {
      const current = get().sessions;
      const removedIndex = current.findIndex((session) => session.id === id);
      const next = current.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fallback = createSessionMeta(bashProfile, 1);
        set({ sessions: [fallback], activeId: fallback.id });
        return;
      }
      const isActive = get().activeId === id;
      set({
        sessions: next,
        activeId: isActive
          ? next[Math.min(removedIndex, next.length - 1)]?.id ?? null
          : get().activeId,
      });
    },
  }),
);
