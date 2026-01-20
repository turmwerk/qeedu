import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailPage from "./DetailPage";
import Dialog from "@/components/Dialog";
import PageShell from "./PageShell";

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const STORAGE_KEY = "syllabus_outlines";
const CURRENT_KEY = "syllabus_current_id";

const DetailRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [md, setMd] = useState("");
  const [openFull, setOpenFull] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadOutlines = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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
    window.addEventListener("syllabus-outlines-updated", onCustom as EventListener);
    return () => {
      window.removeEventListener(
        "syllabus-outlines-updated",
        onCustom as EventListener
      );
    };
  }, [loadOutlines]);

  useEffect(() => {
    if (currentId) return;
    const stateId = (location.state as { id?: string } | null)?.id;
    if (stateId) {
      setCurrentId(stateId);
      return;
    }
    try {
      const savedId = localStorage.getItem(CURRENT_KEY);
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
  }, [currentId, location.state, outlines, navigate, loaded]);

  const persist = useCallback((next: Outline[]) => {
    setOutlines(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("syllabus-outlines-updated"));
    } catch (e) {
      console.error("save outlines", e);
    }
  }, []);

  useEffect(() => {
    if (!currentId) return;
    const found = outlines.find((o) => o.id === currentId);
    if (found) {
      setMd(found.md);
      try {
        localStorage.setItem(CURRENT_KEY, currentId);
      } catch {}
      window.dispatchEvent(
        new CustomEvent("syllabus-current-id", { detail: { id: currentId } })
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
            localStorage.removeItem(CURRENT_KEY);
          } catch {}
          navigate("/teaching/syllabus/ListPage");
        }
      }
    },
    [currentId, navigate, outlines, persist]
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
    window.addEventListener("syllabus-outline-select", onSelect as EventListener);
    window.addEventListener("syllabus-outline-delete", onDelete as EventListener);
    window.addEventListener("syllabus-outline-create", onCreate);
    return () => {
      window.removeEventListener(
        "syllabus-outline-select",
        onSelect as EventListener
      );
      window.removeEventListener(
        "syllabus-outline-delete",
        onDelete as EventListener
      );
      window.removeEventListener("syllabus-outline-create", onCreate);
    };
  }, [handleDelete, navigate]);

  if (!currentOutline) {
    return null;
  }

  return (
    <PageShell contentClassName="p-0">
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
    </PageShell>
  );
};

export default DetailRoute;
