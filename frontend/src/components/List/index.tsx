import React from 'react';
import styles from './style.module.scss';

export interface ListAction<T = any> {
  label: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
}

export interface ListProps<T = any> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  actions?: ListAction<T>[];
  emptyText?: React.ReactNode;
}

function List<T = any>({ items, renderItem, actions, emptyText }: ListProps<T>) {
  if (!items || items.length === 0) {
    return <div className={styles.empty}>{emptyText || '暂无数据'}</div>;
  }
  return (
    <div className={styles.list}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.item}>
          <div>{renderItem(item)}</div>
          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action, i) => (
                <button
                  key={i}
                  className={action.className || styles.btn}
                  onClick={() => action.onClick(item)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default List;
