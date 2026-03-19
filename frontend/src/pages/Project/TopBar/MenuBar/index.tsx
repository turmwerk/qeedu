import React from "react";
import { type TopBarMenuId, type TopBarMenuItem } from "../../data/topBar";

interface MenuBarProps {
  items: TopBarMenuItem[];
  onMenuOpen: (id: TopBarMenuId, event: React.MouseEvent) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ items, onMenuOpen }) => {
  return (
    <div className="flex items-center gap-0.5">
      {items.map((item) => (
        <button
          key={item.id}
          className="rounded px-2 py-0.5 text-xs text-[#cccccc] opacity-80 transition hover:bg-white/10 hover:opacity-100"
          onClick={(event) => onMenuOpen(item.id, event)}
          type="button"
        >
          {item.display}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
