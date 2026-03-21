import React from "react";

export type ResizeHandleProps = {
	onStartDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onStartDrag }) => {
	return (
		<div
			className="group absolute right-0 top-0 z-10 h-full w-0 overflow-visible"
			role="separator"
			aria-orientation="vertical"
			aria-label="Resize sidebar"
		>
			<div
				className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 cursor-col-resize touch-none transition-colors hover:bg-[#007acc]/10"
				onPointerDown={onStartDrag}
			>
				<div className="absolute left-1/2 top-20 h-[60%] w-px -translate-x-1/2 rounded-full bg-slate-300/80 transition-colors group-hover:bg-[#007acc]/80 dark:bg-white/20 dark:group-hover:bg-[#007acc]/80" />
			</div>
		</div>
	);
};

export default ResizeHandle;
