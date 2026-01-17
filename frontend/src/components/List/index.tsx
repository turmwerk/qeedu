import React, { useState } from "react";

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
}

function List<T = any>({
  items,
  renderItem,
  actions,
  emptyText,
  editable,
  keyExtractor,
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
      className="flex flex-col gap-3 max-h-[420px] overflow-auto"
      data-oid="uhdlmu-"
    >
      {items.map((item, idx) => {
        const rawKey = keyExtractor ? keyExtractor(item) : idx;
        const key = String(rawKey);
        const isEditing = editingKey === key;

        return (
          <div
            key={key}
            className="flex justify-between items-center bg-[var(--brand-accent-soft)] p-3 rounded-[10px] border border-transparent transition-[box-shadow,border-color,background] hover:shadow-[var(--brand-shadow)] hover:border-[var(--brand-accent)] hover:bg-white"
            data-oid="_99fzva"
          >
            <div
              className="w-10 text-center text-[var(--brand-accent)] font-bold mr-3"
              data-oid="9yfs1_:"
            >
              {idx + 1}
            </div>
            <div className="flex-1" data-oid="e8n4vyz">
              {isEditing ? (
                <div className="flex items-center" data-oid="lil:ql8">
                  <input
                    className="w-[420px] px-2.5 py-2 rounded-md border border-[rgba(0,0,0,0.12)] mr-2"
                    aria-label="重命名"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
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
                      <button
                        key={i}
                        className={
                          action.className ||
                          "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                        }
                        onClick={() => {
                          const start = editable ? editable.getValue(item) : "";
                          setEditingValue(start);
                          setEditingKey(key);
                        }}
                        data-oid="b_t10g-"
                      >
                        {action.label}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={i}
                      className={
                        action.className ||
                        "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                      }
                      onClick={() => action.onClick(item)}
                      data-oid="iqsl-65"
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}

            {isEditing && (
              <div className="flex gap-2" data-oid="ylq3eih">
                <button
                  className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                  onClick={() => {
                    const renameAction = actions?.find((a) => a.isRename);
                    if (renameAction) renameAction.onClick(item, editingValue);
                    setEditingKey(null);
                  }}
                  data-oid="qc2lvtt"
                >
                  确定
                </button>
                <button
                  className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                  onClick={() => setEditingKey(null)}
                  data-oid="ta682i1"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default List;
