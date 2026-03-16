import React from "react";
import Modal from "@/ui/Modal";

export type ListModalItem = {
	id: string;
	title: string;
	subtitle?: string;
	md?: string;
	createdAt?: number;
};

export type ListModalProps = {
	items: ListModalItem[];
	onEdit: (id?: string) => void;
	onCreate: (payload: Record<string, unknown>) => void;
	onDelete: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	openSignal?: number;
	modalMode?: boolean;
	onCloseModal?: () => void;
	currentId?: string | null;
};

export type ListModalWrapperProps = {
	open: boolean;
	onClose: () => void;
	items: ListModalItem[];
	onEdit: (id?: string) => void;
	onCreate: (payload: Record<string, unknown>) => void;
	onDelete: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	currentId?: string | null;
	ListModalComponent?: React.ComponentType<ListModalProps>;
};

const ListModal: React.FC<ListModalWrapperProps> = ({
	open,
	onClose,
	items,
	onEdit,
	onCreate,
	onDelete,
	onRename,
	currentId,
	ListModalComponent,
}) => {
	if (!ListModalComponent) return null;

	return (
		<Modal
			visible={open}
			onClose={onClose}
			width={1100}
			showHeader={false}
			bodyClassName="p-2 max-h-[calc(90vh-24px)] overflow-auto"
		>
			<ListModalComponent
				items={items}
				onEdit={onEdit}
				onCreate={onCreate}
				onDelete={onDelete}
				onRename={onRename}
				modalMode
				onCloseModal={onClose}
				currentId={currentId}
			/>
		</Modal>
	);
};

export default ListModal;
