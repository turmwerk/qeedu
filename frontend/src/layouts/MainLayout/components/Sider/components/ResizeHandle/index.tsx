import React from "react";

export type ResizeHandleProps = {
	onStartDrag: () => void;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onStartDrag }) => {
	return (
		<div
			className="absolute right-0 top-0 h-full w-[8px] cursor-col-resize hover:bg-purple-200/30 transition-colors"
			onMouseDown={onStartDrag}
			onTouchStart={onStartDrag}
			role="separator"
			aria-orientation="vertical"
			aria-label="Resize sidebar"
		>
			<div className="absolute right-[3px] top-20 h-[60%] w-[2px] rounded-full bg-purple-300/80" />
		</div>
	);
};

export default ResizeHandle;
