import React, { useId } from 'react';
import { createPortal } from 'react-dom';

const Model: React.FC<{ visible: boolean; title?: React.ReactNode; onClose: () => void; children?: React.ReactNode; width?: number | string }> = ({ visible, title, onClose, children, width }) => {
  const id = useId().replace(/[:]/g, '');
  const widthClass = width ? `modal-width-${id}` : '';
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  if (!visible) return null;
  return createPortal(
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] flex items-center justify-center z-[1000]" onMouseDown={onClose}>
      <style>{width ? `.${widthClass} { width: ${widthValue}; }` : ''}</style>
      <div className={`w-[780px] max-w-[calc(100%-40px)] bg-white rounded-xl shadow-[0_12px_40px_rgba(16,24,40,0.24)] overflow-hidden ${widthClass}`} onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f1f1]">
          <div className="font-bold text-[#2d1b4f]">{title}</div>
          <button className="bg-transparent border-0 text-[20px] cursor-pointer" onClick={onClose}>×</button>
        </div>
        <div className="px-5 py-[18px] max-h-[calc(90vh-72px)] overflow-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Model;
