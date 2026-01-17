import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-[9999] pointer-events-none items-center justify-center">
      <style>{`
        @keyframes toastIn {
          from { transform: translateY(8px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .toast-item { animation: toastIn 240ms ease-out; }
      `}</style>
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast-item pointer-events-auto bg-[var(--brand-accent)] text-white px-3.5 py-2.5 rounded-[22px] shadow-[var(--brand-shadow)] font-semibold min-w-[120px] max-w-[640px] text-center"
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
