import { create } from "zustand";
import { CompletionMode } from "./types";

const STORAGE_KEY = "completion_mode";

function loadMode(): CompletionMode {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw && Object.values(CompletionMode).includes(raw as CompletionMode)) {
			return raw as CompletionMode;
		}
	} catch {}
	return CompletionMode.BASIC;
}

interface CompletionStoreState {
	mode: CompletionMode;
	setMode: (mode: CompletionMode) => void;
}

export const useCompletionStore = create<CompletionStoreState>((set) => ({
	mode: loadMode(),
	setMode: (mode) => {
		try {
			localStorage.setItem(STORAGE_KEY, mode);
		} catch {}
		set({ mode });
	},
}));
