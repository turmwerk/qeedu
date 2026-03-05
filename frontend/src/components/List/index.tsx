import React, { useState } from "react";
import Button from "@/components/Button";

export interface ListAction<T = any> {
  label: React.ReactNode;
  onClick: (item: T, payload?: any) => void;
  className?: string;
  /** 标记该操作为重命名操作，List 会在本行展示输入框并在确认时调用 onClick(item, newName) */
  isRename?: boolean;
}

export interface EditableProps<T = any> {
  getValue: (item: T) => string;
}

export interface ListProps<T = any> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  actions?: ListAction<T>[];
  emptyText?: React.ReactNode;
  /** 用于行内重命名时获取初始值 */
  editable?: EditableProps<T>;
  /** 可选：用于生成稳定的 key（默认为索引） */
  keyExtractor?: (item: T) => string | number;
  /** 点击条目行 */
  onItemClick?: (item: T) => void;
  /** 条目是否禁用点击 */
  isItemDisabled?: (item: T) => boolean;
  /** 自定义条目容器样式 */
  itemClassName?: (item: T) => string;
  /** 是否显示条目悬浮光晕（默认 true） */
  hoverGlow?: boolean;
  /** 操作按钮默认样式（当 action 未提供 className 时） */
  defaultActionClassName?: string;
  /** 编辑态（确定/取消）按钮样式 */
  editingActionClassName?: string;
}

function List<T = any>({
  items,
  renderItem,
  actions,
  emptyText,
  editable,
  keyExtractor,
  onItemClick,
  isItemDisabled,
  itemClassName,
  hoverGlow = true,
  defaultActionClassName,
  editingActionClassName,
}: ListProps<T>) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  if (!items || items.length === 0) {
    return (
      <div
        className="p-[18px] rounded-[10px] bg-[var(--brand-accent-soft)] text-[#666]"
        data-oid="w2.6yx_"
      >
        {emptyText || "暂无数据"}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 sm:gap-3 max-h-[420px] overflow-y-auto overflow-x-hidden"
      data-oid="uhdlmu-"
    >
      {items.map((item, idx) => {
        const rawKey = keyExtractor ? keyExtractor(item) : idx;
        const key = String(rawKey);
        const isEditing = editingKey === key;
        const disabled = isItemDisabled ? isItemDisabled(item) : false;

        return (
          <div
            key={key}
            className={`group relative flex justify-between items-center bg-white/70 dark:bg-white/[0.34] p-2.5 sm:p-4 rounded-[12px] border border-transparent dark:border-white/50 transition-[box-shadow,border-color,background] hover:shadow-[0_12px_26px_rgba(17,24,39,0.12)] hover:border-[var(--brand-accent)] dark:hover:border-white/[0.65] hover:bg-white dark:hover:bg-white/[0.48] ${
              onItemClick && !disabled ? "cursor-pointer" : ""
            } ${itemClassName ? itemClassName(item) : ""}`}
            onClick={() => {
              if (isEditing) return;
              if (disabled) return;
              if (onItemClick) onItemClick(item);
            }}
            data-oid="_99fzva"
          >

            {onItemClick && hoverGlow && (
              <div className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="absolute -inset-2 rounded-[14px] bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)] blur-[10px]" />
              </div>
            )}
            <div
              className="teaching-list-index w-7 sm:w-10 text-center text-[var(--brand-blue)] dark:text-[#dbeafe] font-bold mr-1.5 sm:mr-3 text-[13px] sm:text-base"
              data-oid="9yfs1_:"
            >
              {idx + 1}
            </div>
            <div className="flex-1" data-oid="e8n4vyz">
              {isEditing ? (
                <div className="flex items-center" data-oid="lil:ql8">
                  <input
                    className="w-full sm:w-[420px] px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-md border border-[rgba(0,0,0,0.12)] mr-2 text-[13px] sm:text-base"
                    aria-label="重命名"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // 找到重命名 action 并触发
                        const renameAction = actions?.find((a) => a.isRename);
                        if (renameAction)
                          renameAction.onClick(item, editingValue);
                        setEditingKey(null);
                      } else if (e.key === "Escape") {
                        setEditingKey(null);
                      }
                    }}
                    data-oid="uqsp0nh"
                  />
                </div>
              ) : (
                <div data-oid="my0l7ac">{renderItem(item)}</div>
              )}
            </div>

            {!isEditing && actions && actions.length > 0 && (
              <div className="flex gap-2" data-oid="spxlezq">
                {actions.map((action, i) => {
                  // 对于重命名动作，List 自行切换到编辑模式并填充初始值
                  if (action.isRename) {
                    return (
                      <Button
                        key={i}
                        className={
                          action.className ||
                          defaultActionClassName ||
                          "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          const start = editable ? editable.getValue(item) : "";
                          setEditingValue(start);
                          setEditingKey(key);
                        }}
                        data-oid="b_t10g-"
                      >
                        {action.label}
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={i}
                      className={
                        action.className ||
                        defaultActionClassName ||
                        "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(item);
                      }}
                      data-oid="iqsl-65"
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}

            {isEditing && (
              <div className="flex gap-2" data-oid="ylq3eih">
                <Button
                  className={
                    editingActionClassName ||
                    defaultActionClassName ||
                    "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    const renameAction = actions?.find((a) => a.isRename);
                    if (renameAction) renameAction.onClick(item, editingValue);
                    setEditingKey(null);
                  }}
                  data-oid="qc2lvtt"
                >
                  确定
                </Button>
                <Button
                  className={
                    editingActionClassName ||
                    defaultActionClassName ||
                    "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingKey(null);
                  }}
                  data-oid="ta682i1"
                >
                  取消
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default List;
