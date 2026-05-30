import { useSyncExternalStore, useCallback, useEffect, useState } from "react";
import { apiUrl } from "@/api/config";

// Auth state: fetched from /me via httpOnly cookie.
let snapshot: { user: { id: number; name: string } | null } = { user: null };
let fetchPromise: Promise<void> | null = null;

function subscribe(cb: () => void) {
	const onAuth = () => {
		fetchPromise = null;
		cb();
	};
	window.addEventListener("auth-change", onAuth);
	return () => window.removeEventListener("auth-change", onAuth);
}

function getSnapshot() {
	return snapshot;
}

async function refreshAuth(): Promise<void> {
	if (fetchPromise) return fetchPromise;
	fetchPromise = fetch(apiUrl("/me"), { credentials: "include" })
		.then((res) => {
			if (res.ok) return res.json();
			throw new Error("not authenticated");
		})
		.then((data: Record<string, unknown>) => {
			snapshot = {
				user: {
					id: (data.id as number) || (data.user_id as number) || 0,
					name: (data.name as string) || "",
				},
			};
		})
		.catch(() => {
			snapshot = { user: null };
		})
		.finally(() => {
			window.dispatchEvent(new Event("auth-change"));
		});
	return fetchPromise;
}

export function useAuth() {
	const state = useSyncExternalStore(subscribe, getSnapshot);
	const [loading, setLoading] = useState(!state.user);

	useEffect(() => {
		refreshAuth().then(() => setLoading(false));
	}, []);

	return {
		isAuthenticated: !!state.user,
		user: state.user,
		loading,
		logout: useCallback(async () => {
			// Server-side: cookie is httpOnly; can't clear from JS.
			// The server should provide a /logout endpoint, but for now
			// just clear local state.
			snapshot = { user: null };
			window.dispatchEvent(new Event("auth-change"));
		}, []),
		refresh: refreshAuth,
	};
}
