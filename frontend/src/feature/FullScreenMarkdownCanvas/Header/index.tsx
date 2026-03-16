import React from "react";
import { MenuOutlined, SettingOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import Button from "@/ui/Button";

const actionBtn =
  "inline-flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/30 text-[var(--brand-blue)] px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform,color] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";

const siderToggleBtn =
  "flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-transparent border border-transparent dark:border-white/30 text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)]";

type Props = {
  siderOpen: boolean;
  onToggleSider: () => void;
  theme: string;
  onToggleTheme: () => void;
  onSave: () => void;
  onClose: () => void;
};

const CanvasHeader: React.FC<Props> = ({
  siderOpen,
  onToggleSider,
  theme,
  onToggleTheme,
  onSave,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 py-0.5 border-b border-white/40 dark:border-white/10 bg-gradient-to-r from-white/70 via-purple-50/60 to-indigo-50/60 dark:from-[#1a2d48]/80 dark:via-[#1e293b]/70 dark:to-[#1a2d48]/70 shadow-[0_10px_30px_rgba(124,58,237,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      {/* Left: sider toggle + title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {!siderOpen && (
          <Button className={siderToggleBtn} onClick={onToggleSider} aria-label="打开侧边栏">
            <MenuOutlined />
          </Button>
        )}
        <div className="text-[13px] sm:text-lg font-semibold text-[var(--brand-blue)]">画布编辑</div>
      </div>

      {/* Right: action buttons — order: 设置 → 主题 → 保存 → 关闭 */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* 设置 */}
        <Button className={actionBtn} onClick={() => {}}>
          <SettingOutlined />
          <span className="hidden sm:inline">设置</span>
        </Button>

        {/* 主题 */}
        <Button className={actionBtn} onClick={onToggleTheme} aria-label="切换主题">
          {theme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
              <path d="M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.93 4.93L3.51 3.51" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 20.49l-1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 12h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.93 19.07l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 3.51l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span className="hidden sm:inline">主题</span>
        </Button>

        {/* 保存（不关闭） */}
        <Button className={actionBtn} onClick={onSave} aria-label="保存">
          <SaveOutlined />
          <span className="hidden sm:inline">保存</span>
        </Button>

        {/* 关闭（不保存） */}
        <Button className={actionBtn} onClick={onClose} aria-label="关闭">
          <CloseOutlined />
          <span className="hidden sm:inline">关闭</span>
        </Button>
      </div>
    </div>
  );
};

export default CanvasHeader;
