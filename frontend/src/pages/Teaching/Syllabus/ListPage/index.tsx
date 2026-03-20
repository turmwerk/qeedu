import React from "react";
import ListModal from "../ListModal";
import type { Outline } from "../types";

const ListPage: React.FC<{
  items: Outline[];
  onEdit: (id?: string) => void;
  onCreate: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  openSignal?: number;
}> = ({ items, onEdit, onCreate, onDelete, onRename, openSignal }) => {
  return (
    <ListModal
      items={items}
      onEdit={onEdit}
      onCreate={onCreate}
      onDelete={onDelete}
      onRename={onRename}
      openSignal={openSignal}
    />
  );
};

export default ListPage;
