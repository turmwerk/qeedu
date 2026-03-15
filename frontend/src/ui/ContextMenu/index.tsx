import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type ContextMenuItem =
  | {
      type?: "item";
      id?: string;
      label: string;
      shortcut?: string;
      icon?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      danger?: boolean;
      checked?: boolean;
    }
  | {
      type: "separator";
      id?: string;
    };

export interface ContextMenuOptions {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

interface ContextMenuState extends ContextMenuOptions {
  isOpen: boolean;
}

interface ContextMenuContextValue {
  openMenu: (options: ContextMenuOptions) => void;
  openAtEvent: (event: React.MouseEvent, items: ContextMenuItem[]) => void;
  closeMenu: () => void;
  isOpen: boolean;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenu = (): ContextMenuContextValue => {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error("useContextMenu must be used within ContextMenuProvider");
  }
  return ctx;
};

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ContextMenuState | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setState(null);
    setPosition(null);
  }, []);

  const openMenu = useCallback((options: ContextMenuOptions) => {
    setState({ ...options, isOpen: true });
    setPosition({ x: options.x, y: options.y });
  }, []);

  const openAtEvent = useCallback(
    (event: React.MouseEvent, items: ContextMenuItem[]) => {
      event.preventDefault();
      openMenu({ x: event.clientX, y: event.clientY, items });
    },
    [openMenu],
  );

  useEffect(() => {
    if (!state?.isOpen) return;
    const handleClick = () => closeMenu();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const handleScroll = () => closeMenu();
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [closeMenu, state?.isOpen]);

  useLayoutEffect(() => {
    if (!state?.isOpen || !menuRef.current || !position) return;
    const rect = menuRef.current.getBoundingClientRect();
    const margin = 8;
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;
    const nextX = Math.max(margin, Math.min(position.x, maxX));
    const nextY = Math.max(margin, Math.min(position.y, maxY));
    if (nextX !== position.x || nextY !== position.y) {
      setPosition({ x: nextX, y: nextY });
    }
  }, [position, state?.isOpen]);

  const value = useMemo(
    () => ({
      openMenu,
      openAtEvent,
      closeMenu,
      isOpen: !!state?.isOpen,
    }),
    [openAtEvent, openMenu, closeMenu, state?.isOpen],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      {state?.isOpen && position
        ? createPortal(
            <div
              className="fixed z-[9999]"
              style={{ left: position.x, top: position.y }}
            >
              <div
                ref={menuRef}
                className="min-w-[200px] rounded border border-[#3c3c3c] bg-[#252526] py-1 text-xs text-[#cccccc] shadow-lg"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {state.items.map((item, index) => {
                  if (item.type === "separator") {
                    return (
                      <div
                        key={item.id ?? `sep-${index}`}
                        className="my-1 border-t border-[#3c3c3c]"
                      />
                    );
                  }
                  const disabled = item.disabled;
                  return (
                    <button
                      key={item.id ?? item.label}
                      disabled={disabled}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                        disabled
                          ? "cursor-not-allowed text-[#666666]"
                          : item.danger
                            ? "text-[#f48771] hover:bg-[#3a1f1f]"
                            : "hover:bg-[#094771] hover:text-white"
                      }`}
                      onClick={() => {
                        if (disabled) return;
                        item.onClick?.();
                        closeMenu();
                      }}
                    >
                      <span className="flex w-4 items-center justify-center text-[10px]">
                        {item.checked ? "✓" : item.icon ?? null}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-[#9d9d9d]">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </ContextMenuContext.Provider>
  );
};

export default ContextMenuProvider;
