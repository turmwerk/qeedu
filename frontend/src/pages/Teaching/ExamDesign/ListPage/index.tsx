import React from "react";
import ListModal from "../ListModal";

type ExamItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: ExamItem[];
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
