import React, { useCallback, useEffect, useRef, useState } from "react";
import Model from "@/components/Model";
import Form from "@/components/Form";
import {
  getExamCreateFields,
  type DifficultyValue,
} from "../../data/createModalFields";

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Record<string, unknown>) => void;
};

// DifficultyPicker with two draggable knobs controlling boundaries between easy|medium|hard
const DifficultyPicker: React.FC<{
  value?: DifficultyValue;
  onChange: (v: DifficultyValue) => void;
}> = ({ value, onChange }) => {
  const init: DifficultyValue = value || { easy: 30, medium: 50, hard: 20 };
  // positions: p1 = easy%, p2 = easy+medium%
  const [p1, setP1] = useState<number>(init.easy);
  const [p2, setP2] = useState<number>(init.easy + init.medium);
  const barRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef<"p1" | "p2" | null>(null);

  useEffect(() => {
    // sync when external value changes (async to avoid sync setState warning)
    const v: DifficultyValue = value || { easy: 30, medium: 50, hard: 20 };
    const id = window.setTimeout(() => {
      setP1(v.easy);
      setP2(v.easy + v.medium);
    }, 0);
    return () => window.clearTimeout(id);
  }, [value]);

  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.setProperty("--p1", String(p1));
    barRef.current.style.setProperty("--p2", String(p2));
  }, [p1, p2]);

  const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

  const updateFromPositions = useCallback(
    (np1: number, np2: number) => {
      const easy = Math.round(clamp(np1, 0, np2));
      const medium = Math.round(clamp(np2 - np1, 0, 100 - easy));
      const hard = 100 - easy - medium;
      onChange({ easy, medium, hard });
    },
    [onChange],
  );

  const onMove = useCallback(
    (clientX: number) => {
    const bar = barRef.current;
    if (!bar || !dragging.current) return;
    const rect = bar.getBoundingClientRect();
    const rel = ((clientX - rect.left) / rect.width) * 100;
    if (dragging.current === "p1") {
      const np1 = clamp(rel, 0, p2 - 1);
      setP1(np1);
      updateFromPositions(np1, p2);
    } else if (dragging.current === "p2") {
      const np2 = clamp(rel, p1 + 1, 100);
      setP2(np2);
      updateFromPositions(p1, np2);
    }
  },
  [p1, p2, updateFromPositions],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const stop = () => {
      dragging.current = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, [onMove]);

  return (
    <div className="flex flex-col gap-1.5 py-1">
      <style>{`
        .difficulty-bar {
          position: relative;
          height: 8px;
          background: #f0e7ff;
          border-radius: 4px;
        }
        .difficulty-seg-easy { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--p1) * 1%); background: #6b2fb1; border-radius: 4px 0 0 4px; }
        .difficulty-seg-medium { position: absolute; left: calc(var(--p1) * 1%); top: 0; bottom: 0; width: calc((var(--p2) - var(--p1)) * 1%); background: #b080ff; }
        .difficulty-seg-hard { position: absolute; left: calc(var(--p2) * 1%); top: 0; bottom: 0; right: 0; background: #e9ddff; border-radius: 0 4px 4px 0; }
        .difficulty-knob { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 14px; height: 14px; border-radius: 4px; background: #fff; border: 3px solid #6b2fb1; box-shadow: 0 2px 6px rgba(0,0,0,0.12); cursor: grab; z-index: 10; }
        .difficulty-knob.p1 { left: calc(var(--p1) * 1%); }
        .difficulty-knob.p2 { left: calc(var(--p2) * 1%); }
      `}</style>
      <div className="px-3 py-1 rounded-lg bg-white/60 backdrop-blur-sm max-w-[400px]">
        <div ref={barRef} className="difficulty-bar">
          <div className="difficulty-seg-easy" />
          <div className="difficulty-seg-medium" />
          <div className="difficulty-seg-hard" />

          <div
            onMouseDown={(e) => {
              e.preventDefault();
              dragging.current = "p1";
            }}
            onTouchStart={() => {
              dragging.current = "p1";
            }}
            className="difficulty-knob p1"
            title="拖动调整简单比例"
          />

          <div
            onMouseDown={(e) => {
              e.preventDefault();
              dragging.current = "p2";
            }}
            onTouchStart={() => {
              dragging.current = "p2";
            }}
            className="difficulty-knob p2"
            title="拖动调整中等比例"
          />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-[13px] text-[#666]">简单</label>
        <span className="text-[14px] font-bold">{Math.round(p1)}%</span>
        <div className="w-px h-3 bg-[#eee]" />
        <label className="text-[13px] text-[#666]">中等</label>
        <span className="text-[14px] font-bold">{Math.round(p2 - p1)}%</span>
        <div className="w-px h-3 bg-[#eee]" />
        <label className="text-[13px] text-[#666]">困难</label>
        <span className="text-[14px] font-bold">{Math.round(100 - p2)}%</span>
      </div>
    </div>
  );
};

const CreateModal: React.FC<CreateModalProps> = ({ open, onClose, onCreate }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isCreating) return;
    setIsCreating(true);
    setTimeout(() => {
      onCreate(values);
      onClose();
      setIsCreating(false);
    }, 600);
  };

  return (
    <Model
      visible={open}
      title="新建试卷"
      width={1000}
      onClose={onClose}
    >
      <div>
        <p className="text-[#666]">
          填写试卷基本信息以便快速生成试卷初稿。
        </p>
        <div className="mt-3">
          <Form
            mode="table"
            fields={getExamCreateFields(DifficultyPicker)}
            submitText="生成初稿"
            submitLoading={isCreating}
            submitLoadingText="生成中"
            submitDisabled={isCreating}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Model>
  );
};

export default CreateModal;
