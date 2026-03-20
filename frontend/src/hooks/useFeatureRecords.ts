import { useCallback, useEffect, useState } from "react";

type FeatureAdapter<T> = {
  list: () => T[];
  create: (payload: Partial<T> & Record<string, unknown>) => T;
  patch: (id: string, patch: Partial<T> & Record<string, unknown>) => T | null;
  remove: (id: string) => T[];
  duplicate: (id: string) => T | null;
};

export const useFeatureRecords = <T extends { id: string }>(
  adapter: FeatureAdapter<T>,
) => {
  const [records, setRecords] = useState<T[]>([]);

  const refresh = useCallback(() => {
    setRecords([...adapter.list()]);
  }, [adapter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createRecord = useCallback(
    (payload: Partial<T> & Record<string, unknown>) => {
      const created = adapter.create(payload);
      refresh();
      return created;
    },
    [adapter, refresh],
  );

  const patchRecord = useCallback(
    (id: string, patch: Partial<T> & Record<string, unknown>) => {
      const updated = adapter.patch(id, patch);
      refresh();
      return updated;
    },
    [adapter, refresh],
  );

  const removeRecord = useCallback(
    (id: string) => {
      adapter.remove(id);
      refresh();
    },
    [adapter, refresh],
  );

  const duplicateRecord = useCallback(
    (id: string) => {
      const duplicated = adapter.duplicate(id);
      refresh();
      return duplicated;
    },
    [adapter, refresh],
  );

  return {
    records,
    refresh,
    createRecord,
    patchRecord,
    removeRecord,
    duplicateRecord,
  };
};
