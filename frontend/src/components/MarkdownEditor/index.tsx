import React, { useState } from 'react';
import MarkdownView from '@/components/MarkdownView';

interface Props {
  value?: string;
  onClose: (updated: string | null) => void; // pass null to cancel
}

const MarkdownEditor: React.FC<Props> = ({ value = '', onClose }) => {
  const [text, setText] = useState(value);

  return (
    <div className="markdown-overlay fixed inset-0 bg-[rgba(15,15,20,0.28)] flex items-stretch justify-stretch p-2 z-[1400]" role="dialog" aria-modal="true">
      <style>{`
        @keyframes markdownOverlayFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes markdownSheetPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .markdown-overlay { animation: markdownOverlayFade 0.24s ease; }
        .markdown-sheet { animation: markdownSheetPop 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
      <div className="markdown-sheet bg-white rounded-xl m-2 p-3.5 shadow-[0_12px_40px_rgba(16,24,40,0.12)] w-[calc(100%-16px)] h-[calc(100%-16px)] flex flex-col box-border">
        <div className="flex justify-between items-center text-[#24124a] mb-3.5">
          <div className="text-[18px] font-bold">画布编辑</div>
          <div className="flex gap-2.5">
            <button className="bg-transparent border border-[var(--brand-border)] px-3.5 py-2 rounded-lg cursor-pointer text-[var(--brand-accent)] transition-[box-shadow,background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]" onClick={() => onClose(null)}>取消</button>
            <button
              className="bg-[var(--brand-accent)] text-white border-0 px-3.5 py-2 rounded-lg cursor-pointer transition-[box-shadow,background] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]"
              onClick={() => onClose(text)}
            >保存并退出</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 h-full min-h-0">
          <div className="bg-white p-[18px] rounded-lg h-full overflow-auto border border-dashed border-[var(--brand-border)] box-border min-h-0">
            <MarkdownView value={text} showControls={false} />
          </div>

          <textarea
            className="w-full h-full p-[18px] rounded-lg border border-[rgba(16,24,40,0.06)] resize-none bg-white box-border overflow-auto min-h-0"
            aria-label="编辑内容"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
