import React from "react";
import ConfirmDialog from "@/ui/ConfirmDialog";

export type DeleteConfirmProps = {
	open: boolean;
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
};

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
	open,
	title,
	onConfirm,
	onCancel,
}) => {
	return (
		<ConfirmDialog
			open={open}
			title="确认删除"
			description={`确定要删除"${title}"吗？删除后无法恢复。`}
			confirmText="删除"
			cancelText="取消"
			danger
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
};

export default DeleteConfirm;
