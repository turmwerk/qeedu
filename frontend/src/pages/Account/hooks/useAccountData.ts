import { useCallback, useEffect, useMemo, useState } from "react";
import { getAccountOverview, type AccountOverview } from "@/api/account";

export function useAccountData() {
  const [data, setData] = useState<AccountOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAccountOverview());
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载账户数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return useMemo(() => ({ data, loading, error, reload }), [data, loading, error, reload]);
}
