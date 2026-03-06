export function useAuth() {
  return {
    isAuthenticated: false,
    user: null,
    login: async () => false,
    logout: () => undefined,
  };
}