import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.scss';

type ToastItem = { id: number; message: React.ReactNode; duration: number };

let nextId = 1;

export function showToast(message: React.ReactNode, duration = 3000) {
  window.dispatchEvent(new CustomEvent('nju-show-toast', { detail: { message, duration } }));
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { message, duration } = e.detail || { message: String(e), duration: 3000 };
      const id = nextId++;
      setToasts(prev => [...prev, { id, message, duration }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };
    window.addEventListener('nju-show-toast', handler as EventListener);
    return () => window.removeEventListener('nju-show-toast', handler as EventListener);
  }, []);

  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div className={styles.toastRoot}>
      {toasts.map(t => (
        <div key={t.id} className={styles.toast} role="status">
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
