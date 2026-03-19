import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "@/feature/ChatDialog";
import WorkspaceCreateModal from "./CreateModal";
import WorkspaceDetailPage from "./DetailPage";
import WorkspaceListPage from "./ListPage";
import {
  clearWorkspaceCurrentId,
  getWorkspaceCurrentId,
  getWorkspaceDetailPath,
  getWorkspaceDialogId,
  getWorkspaceNextId,
  loadWorkspaceRecords,
  saveWorkspaceRecords,
  setWorkspaceCurrentId,
} from "./storage";
import type { WorkspaceConfig, WorkspaceRecord } from "./types";

type RouteProps = {
  config: WorkspaceConfig;
};

export const WorkspaceEntryRedirect: React.FC<{
  to: string;
}> = ({ to }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${to}/ListPage`, { replace: true });
  }, [navigate, to]);

  return null;
};

export const WorkspaceListRoute: React.FC<RouteProps> = ({ config }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState<WorkspaceRecord[]>(() =>
    loadWorkspaceRecords(config),
  );
  const [openSignal, setOpenSignal] = useState(0);

  const persist = useCallback(
    (next: WorkspaceRecord[]) => {
      setRecords(next);
      saveWorkspaceRecords(config, next);
    },
    [config],
  );

  useEffect(() => {
    const reload = () => setRecords(loadWorkspaceRecords(config));
    window.addEventListener(config.events.updated, reload);
    return () => {
      window.removeEventListener(config.events.updated, reload);
    };
  }, [config]);

  useEffect(() => {
    const openCreate = (location.state as { openCreate?: boolean } | null)?.openCreate;
    if (openCreate) {
      setOpenSignal((value) => value + 1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleCreate = useCallback(
    (payload: Record<string, unknown>) => {
      const id = getWorkspaceNextId(config);
      const createdAt = Date.now();
      const record = config.buildRecord({ id, createdAt, payload });
      const next = [record, ...records];
      persist(next);
      setWorkspaceCurrentId(config, id);
      navigate(getWorkspaceDetailPath(config, id));
    },
    [config, navigate, persist, records],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = records.filter((record) => record.id !== id);
      persist(next);
      Dialog.clearDialog(getWorkspaceDialogId(config, id));
    },
    [config, persist, records],
  );

  const handleRename = useCallback(
    (id: string, title: string) => {
      const next = records.map((record) =>
        record.id === id
          ? { ...record, title, updatedAt: Date.now() }
          : record,
      );
      persist(next);
    },
    [persist, records],
  );

  const goDetail = useCallback(
    (id?: string) => {
      const targetId = id || records[0]?.id;
      if (!targetId) return;
      setWorkspaceCurrentId(config, targetId);
      navigate(getWorkspaceDetailPath(config, targetId));
    },
    [config, navigate, records],
  );

  useEffect(() => {
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    const onCreate = () => {
      navigate(`${config.routeBase}/ListPage`, { state: { openCreate: true } });
    };

    window.addEventListener(config.events.delete, onDelete as EventListener);
    window.addEventListener(config.events.create, onCreate);
    return () => {
      window.removeEventListener(config.events.delete, onDelete as EventListener);
      window.removeEventListener(config.events.create, onCreate);
    };
  }, [config.events.create, config.events.delete, config.routeBase, handleDelete, navigate]);

  return (
    <WorkspaceListPage
      config={config}
      records={records}
      onEdit={(id) => goDetail(id)}
      onCreate={handleCreate}
      onDelete={(id) => handleDelete(id)}
      onRename={(id, newName) => handleRename(id, newName)}
      openSignal={openSignal}
    />
  );
};

export const WorkspaceDetailRoute: React.FC<RouteProps> = ({ config }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState<WorkspaceRecord[]>(() =>
    loadWorkspaceRecords(config),
  );
  const [manualId, setManualId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const persist = useCallback(
    (next: WorkspaceRecord[]) => {
      setRecords(next);
      saveWorkspaceRecords(config, next);
    },
    [config],
  );

  const reload = useCallback(() => {
    setRecords(loadWorkspaceRecords(config));
  }, [config]);

  useEffect(() => {
    const handleReload = () => reload();
    window.addEventListener(config.events.updated, handleReload as EventListener);
    return () => {
      window.removeEventListener(config.events.updated, handleReload as EventListener);
    };
  }, [config.events.updated, reload]);

  useEffect(() => {
    reload();
    setLoaded(true);
  }, [reload]);

  const queryId = useMemo(
    () => new URLSearchParams(location.search).get("recordId"),
    [location.search],
  );

  const fallbackId = useMemo(() => {
    if (queryId) return queryId;
    const savedId = getWorkspaceCurrentId(config);
    if (savedId) return savedId;
    return records[0]?.id || null;
  }, [config, queryId, records]);

  const currentId = manualId || fallbackId;
  const currentRecord = useMemo(
    () => records.find((record) => record.id === currentId),
    [currentId, records],
  );

  useEffect(() => {
    if (!manualId && queryId) {
      setManualId(queryId);
    }
  }, [manualId, queryId]);

  useEffect(() => {
    if (!loaded) return;
    if (!currentId && records.length === 0) {
      navigate(`${config.routeBase}/ListPage`);
    }
  }, [config.routeBase, currentId, loaded, navigate, records.length]);

  useEffect(() => {
    if (!currentId) return;
    setWorkspaceCurrentId(config, currentId);
  }, [config, currentId]);

  useEffect(() => {
    if (!currentId) return;
    const params = new URLSearchParams(location.search);
    if (params.get("recordId") !== currentId) {
      params.set("recordId", currentId);
      navigate(`${config.routeBase}/detail?${params.toString()}`, { replace: true });
    }
  }, [config.routeBase, currentId, location.search, navigate]);

  useEffect(() => {
    if (!loaded) return;
    if (currentId && !currentRecord) {
      if (records[0]) {
        setManualId(records[0].id);
        return;
      }
      navigate(`${config.routeBase}/ListPage`);
    }
  }, [config.routeBase, currentId, currentRecord, loaded, navigate, records]);

  const handleDelete = useCallback(
    (id: string) => {
      const next = records.filter((record) => record.id !== id);
      persist(next);
      Dialog.clearDialog(getWorkspaceDialogId(config, id));
      if (currentId === id) {
        if (next[0]) {
          setManualId(next[0].id);
        } else {
          setManualId(null);
          clearWorkspaceCurrentId(config);
          navigate(`${config.routeBase}/ListPage`);
        }
      }
    },
    [config, currentId, navigate, persist, records],
  );

  const handleCreate = useCallback(
    (payload: Record<string, unknown>) => {
      const id = getWorkspaceNextId(config);
      const createdAt = Date.now();
      const record = config.buildRecord({ id, createdAt, payload });
      const next = [record, ...records];
      persist(next);
      setManualId(id);
    },
    [config, persist, records],
  );

  const handlePatchRecord = useCallback(
    (patch: Partial<WorkspaceRecord>) => {
      if (!currentId) return;
      const next = records.map((record) =>
        record.id === currentId
          ? { ...record, ...patch, updatedAt: Date.now() }
          : record,
      );
      persist(next);
    },
    [currentId, persist, records],
  );

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id && detail.id !== manualId) {
        setManualId(detail.id);
      }
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    const onCreate = () => {
      setCreateModalOpen(true);
    };

    window.addEventListener(config.events.select, onSelect as EventListener);
    window.addEventListener(config.events.delete, onDelete as EventListener);
    window.addEventListener(config.events.create, onCreate);
    return () => {
      window.removeEventListener(config.events.select, onSelect as EventListener);
      window.removeEventListener(config.events.delete, onDelete as EventListener);
      window.removeEventListener(config.events.create, onCreate);
    };
  }, [config.events.create, config.events.delete, config.events.select, handleDelete, manualId]);

  if (!currentRecord) {
    return null;
  }

  return (
    <>
      <WorkspaceDetailPage
        config={config}
        record={currentRecord}
        onPatchRecord={handlePatchRecord}
      />
      <WorkspaceCreateModal
        config={config}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};
