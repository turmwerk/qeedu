import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "@/feature/ChatDialog";
import { sendChatDialogPrompt } from "@/feature/ChatDialog/events";
import ListPage from "../ListPage/index";
import DetailPage from "../DetailPage/index";
import CreateModal from "../CreateModal";
import {
  SYLLABUS_COUNTER_KEY,
  SYLLABUS_CURRENT_KEY,
  SYLLABUS_EVENTS,
  SYLLABUS_STORAGE_KEY,
} from "../constants";
import type { Outline } from "../types";
import { buildSyllabusMarkdown } from "../utils/buildMarkdown";

export const ListRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [openSignal, setOpenSignal] = useState(0);

  const loadOutlines = useCallback(() => {
    try {
      const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      if (raw) {
        setOutlines(JSON.parse(raw));
      } else {
        setOutlines([]);
      }
    } catch (e) {
      console.error("load outlines", e);
      setOutlines([]);
    }
  }, []);

  useEffect(() => {
    loadOutlines();
    const onCustom = () => loadOutlines();
    window.addEventListener(SYLLABUS_EVENTS.updated, onCustom as EventListener);
    return () => {
      window.removeEventListener(SYLLABUS_EVENTS.updated, onCustom as EventListener);
    };
  }, [loadOutlines]);

  useEffect(() => {
    const openCreate = (location.state as { openCreate?: boolean } | null)
      ?.openCreate;
    if (openCreate) {
      setOpenSignal((v) => v + 1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const persist = useCallback((next: Outline[]) => {
    setOutlines(next);
    try {
      localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SYLLABUS_EVENTS.updated));
    } catch (e) {
      console.error("save outlines", e);
    }
  }, []);

  const setCurrentId = useCallback((id: string) => {
    try {
      localStorage.setItem(SYLLABUS_CURRENT_KEY, id);
    } catch {}
    window.dispatchEvent(
      new CustomEvent(SYLLABUS_EVENTS.currentId, { detail: { id } })
    );
  }, []);

  const getNextId = useCallback(() => {
    let next = 1;
    try {
      const rawCounter = localStorage.getItem(SYLLABUS_COUNTER_KEY);
      if (rawCounter) {
        const parsed = Number.parseInt(rawCounter, 10);
        next = Number.isNaN(parsed) ? 1 : parsed + 1;
      } else {
        const rawList = localStorage.getItem(SYLLABUS_STORAGE_KEY);
        if (rawList) {
          const parsedList = JSON.parse(rawList) as Array<{ id?: string }>;
          const maxId = parsedList.reduce((max, item) => {
            const value = Number.parseInt(String(item.id ?? ""), 10);
            return Number.isNaN(value) ? max : Math.max(max, value);
          }, 0);
          next = maxId + 1;
        }
      }
      localStorage.setItem(SYLLABUS_COUNTER_KEY, String(next));
    } catch {}
    return String(next);
  }, []);

  const handleCreate = useCallback(
    (payload: Record<string, any>) => {
      const id = getNextId();
      const name = payload.name || "未命名课程";
      const mdText = buildSyllabusMarkdown(payload);

      const item: Outline = {
        id,
        title: name,
        md: mdText,
        createdAt: Date.now(),
      };
      const next = [item, ...outlines];
      persist(next);
      setCurrentId(id);
      navigate(`/teaching/syllabus/detail?outlineId=${encodeURIComponent(id)}`);
      window.setTimeout(() => {
        sendChatDialogPrompt(
          id,
          [
            "请基于以下课程信息生成一版可用于教学大纲的优化建议，覆盖课程简介、教学目标、周次安排、考核方式和阅读/作业建议。",
            `课程名称：${name}`,
            `课程类型：${payload.type ?? "未指定"}`,
            `授课对象：${payload.audience ?? "未指定"}`,
            `学分/课时：${payload.credit ?? payload.hours ?? "未指定"}`,
            `已有初稿：\n${mdText}`,
          ].join("\n"),
        );
      }, 300);
    },
    [getNextId, navigate, outlines, persist, setCurrentId]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = outlines.filter((o) => o.id !== id);
      persist(next);
      Dialog.clearDialog(id);
    },
    [outlines, persist]
  );

  const handleRename = useCallback(
    (id: string, newName?: string) => {
      if (!newName) return;
      const next = outlines.map((o) =>
        o.id === id ? { ...o, title: newName } : o,
      );
      persist(next);
    },
    [outlines, persist]
  );

  const goDetail = useCallback(
    (id?: string) => {
      const nextId = id || outlines[0]?.id;
      if (!nextId) return;
      setCurrentId(nextId);
      navigate(`/teaching/syllabus/detail?outlineId=${encodeURIComponent(nextId)}`);
    },
    [navigate, outlines, setCurrentId]
  );

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) setCurrentId(detail.id);
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    const onCreate = () => {
      navigate("/teaching/syllabus/ListPage", { state: { openCreate: true } });
    };
    window.addEventListener(SYLLABUS_EVENTS.select, onSelect as EventListener);
    window.addEventListener(SYLLABUS_EVENTS.delete, onDelete as EventListener);
    window.addEventListener(SYLLABUS_EVENTS.create, onCreate);
    return () => {
      window.removeEventListener(SYLLABUS_EVENTS.select, onSelect as EventListener);
      window.removeEventListener(SYLLABUS_EVENTS.delete, onDelete as EventListener);
      window.removeEventListener(SYLLABUS_EVENTS.create, onCreate);
    };
  }, [handleDelete, navigate]);

  return (
    <ListPage
      items={outlines.map((o) => ({
        id: o.id,
        title: o.title,
        subtitle: o.subtitle,
        md: o.md,
        createdAt: o.createdAt,
      }))}
      onEdit={(id) => goDetail(id)}
      onCreate={handleCreate}
      onDelete={(id) => id && handleDelete(id)}
      onRename={(id, newName) => id && newName && handleRename(id, newName)}
      openSignal={openSignal}
    />
  );
};

export const DetailRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [md, setMd] = useState("");
  const [openFull, setOpenFull] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadOutlines = useCallback(() => {
    try {
      const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      if (raw) {
        setOutlines(JSON.parse(raw));
      } else {
        setOutlines([]);
      }
    } catch (e) {
      console.error("load outlines", e);
      setOutlines([]);
    }
  }, []);

  useEffect(() => {
    loadOutlines();
    setLoaded(true);
    const onCustom = () => loadOutlines();
    window.addEventListener(SYLLABUS_EVENTS.updated, onCustom as EventListener);
    return () => {
      window.removeEventListener(SYLLABUS_EVENTS.updated, onCustom as EventListener);
    };
  }, [loadOutlines]);

  useEffect(() => {
    if (currentId) return;
    const queryId = new URLSearchParams(location.search).get("outlineId");
    if (queryId) {
      setCurrentId(queryId);
      return;
    }
    try {
      const savedId = localStorage.getItem(SYLLABUS_CURRENT_KEY);
      if (savedId) {
        setCurrentId(savedId);
        return;
      }
    } catch {}
    if (outlines[0]) {
      setCurrentId(outlines[0].id);
      return;
    }
    if (loaded && outlines.length === 0) {
      navigate("/teaching/syllabus/ListPage");
    }
  }, [currentId, location.search, outlines, navigate, loaded]);

  useEffect(() => {
    if (!currentId) return;
    const params = new URLSearchParams(location.search);
    if (params.get("outlineId") !== currentId) {
      params.set("outlineId", currentId);
      navigate(`/teaching/syllabus/detail?${params.toString()}`, { replace: true });
    }
  }, [currentId, location.search, navigate]);

  const persist = useCallback((next: Outline[]) => {
    setOutlines(next);
    try {
      localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SYLLABUS_EVENTS.updated));
    } catch (e) {
      console.error("save outlines", e);
    }
  }, []);

  useEffect(() => {
    if (!currentId) return;
    const found = outlines.find((o) => o.id === currentId);
    if (found) {
      setMd(found.md ?? "");
      try {
        localStorage.setItem(SYLLABUS_CURRENT_KEY, currentId);
      } catch {}
      window.dispatchEvent(
        new CustomEvent(SYLLABUS_EVENTS.currentId, { detail: { id: currentId } })
      );
    }
  }, [currentId, outlines]);

  const currentOutline = useMemo(
    () => outlines.find((o) => o.id === currentId),
    [outlines, currentId]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = outlines.filter((o) => o.id !== id);
      persist(next);
      Dialog.clearDialog(id);
      if (currentId === id) {
        if (next[0]) {
          setCurrentId(next[0].id);
        } else {
          setCurrentId(null);
          try {
            localStorage.removeItem(SYLLABUS_CURRENT_KEY);
          } catch {}
          navigate("/teaching/syllabus/ListPage");
        }
      }
    },
    [currentId, navigate, outlines, persist]
  );

  const getNextId = useCallback(() => {
    let next = 1;
    try {
      const rawCounter = localStorage.getItem(SYLLABUS_COUNTER_KEY);
      if (rawCounter) {
        const parsed = Number.parseInt(rawCounter, 10);
        next = Number.isNaN(parsed) ? 1 : parsed + 1;
      } else {
        const rawList = localStorage.getItem(SYLLABUS_STORAGE_KEY);
        if (rawList) {
          const parsedList = JSON.parse(rawList) as Array<{ id?: string }>;
          const maxId = parsedList.reduce((max, item) => {
            const value = Number.parseInt(String(item.id ?? ""), 10);
            return Number.isNaN(value) ? max : Math.max(max, value);
          }, 0);
          next = maxId + 1;
        }
      }
      localStorage.setItem(SYLLABUS_COUNTER_KEY, String(next));
    } catch {}
    return String(next);
  }, []);

  const handleCreate = useCallback(
    (payload: Record<string, any>) => {
      const id = getNextId();
      const name = payload.name || "未命名课程";
      const mdContent = buildSyllabusMarkdown(payload);

      const item: Outline = {
        id,
        title: name,
        md: mdContent,
        createdAt: Date.now(),
      };
      const next = [item, ...outlines];
      persist(next);
      setCurrentId(id);
    },
    [getNextId, outlines, persist]
  );

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id && detail.id !== currentId) setCurrentId(detail.id);
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    const onCreate = () => {
      setCreateModalOpen(true);
    };
    window.addEventListener(
      SYLLABUS_EVENTS.select,
      onSelect as EventListener
    );
    window.addEventListener(
      SYLLABUS_EVENTS.delete,
      onDelete as EventListener
    );
    window.addEventListener(SYLLABUS_EVENTS.create, onCreate);
    return () => {
      window.removeEventListener(
        SYLLABUS_EVENTS.select,
        onSelect as EventListener
      );
      window.removeEventListener(
        SYLLABUS_EVENTS.delete,
        onDelete as EventListener
      );
      window.removeEventListener(SYLLABUS_EVENTS.create, onCreate);
    };
  }, [currentId, handleDelete]);

  if (!currentOutline) {
    return null;
  }

  return (
    <>
      <DetailPage
        md={md}
        setMd={(updated: string) => {
          setMd(updated);
          if (currentId) {
            const next = outlines.map((o) =>
              o.id === currentId ? { ...o, md: updated } : o,
            );
            persist(next);
          }
        }}
        onBack={() => {
          setOpenFull(false);
          navigate("/teaching/syllabus/ListPage");
        }}
        openFull={openFull}
        setOpenFull={setOpenFull}
        title={currentOutline?.title}
        id={currentOutline?.id}
        onRename={(id, newName) => {
          if (!newName) return;
          const next = outlines.map((o) =>
            o.id === id ? { ...o, title: newName } : o,
          );
          persist(next);
        }}
      />
      <CreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};
