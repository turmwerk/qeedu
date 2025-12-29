import React, { useState } from 'react';
import styles from './style.module.scss';

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

function List<T = any>({ items, renderItem, actions, emptyText, editable, keyExtractor }: ListProps<T>) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  if (!items || items.length === 0) {
    return <div className={styles.empty}>{emptyText || '暂无数据'}</div>;
  }

  return (
    <div className={styles.list}>
      {items.map((item, idx) => {
        const rawKey = keyExtractor ? keyExtractor(item) : idx;
        const key = String(rawKey);
        const isEditing = editingKey === key;

        return (
          <div key={key} className={styles.item}>
            <div className={styles.index}>{idx + 1}</div>
            <div className={styles.content}>
              {isEditing ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // 找到重命名 action 并触发
                        const renameAction = actions?.find(a => a.isRename);
                        if (renameAction) renameAction.onClick(item, editingValue);
                        setEditingKey(null);
                      } else if (e.key === 'Escape') {
                        setEditingKey(null);
                      }
                    }}
                  />
                </div>
              ) : (
                <div>{renderItem(item)}</div>
              )}
            </div>

            {(!isEditing && actions && actions.length > 0) && (
              <div className={styles.actions}>
                {actions.map((action, i) => {
                  // 对于重命名动作，List 自行切换到编辑模式并填充初始值
                  if (action.isRename) {
                    return (
                      <button
                        key={i}
                        className={action.className || styles.btn}
                        onClick={() => {
                          const start = editable ? editable.getValue(item) : '';
                          setEditingValue(start);
                          setEditingKey(key);
                        }}
                      >
                        {action.label}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={i}
                      className={action.className || styles.btn}
                      onClick={() => action.onClick(item)}
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}

            {isEditing && (
              <div className={styles.editActions}>
                <button
                  className={styles.btn}
                  onClick={() => {
                    const renameAction = actions?.find(a => a.isRename);
                    if (renameAction) renameAction.onClick(item, editingValue);
                    setEditingKey(null);
                  }}
                >确定</button>
                <button className={styles.btn} onClick={() => setEditingKey(null)}>取消</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default List;
