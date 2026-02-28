import React from "react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	leftSlot?: React.ReactNode;
	rightSlot?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
	value,
	onChange,
	placeholder = "搜索",
	className,
	inputClassName,
	leftSlot,
	rightSlot,
}) => {
	const leftPad = leftSlot ? "pl-9" : "pl-3";
	const rightPad = rightSlot ? "pr-9" : "pr-3";

	return (
		<div
			className={`relative flex items-center h-9 rounded-xl border border-transparent dark:border-white/[0.45] bg-white/90 shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition-[border-color,box-shadow] hover:border-[var(--brand-accent)] focus-within:border-[var(--brand-accent)] focus-within:shadow-[0_8px_20px_rgba(59,130,246,0.16)] ${
				className || ""
			}`}
		>
			{leftSlot && (
				<div className="absolute left-1.5 top-1/2 -translate-y-1/2">
					{leftSlot}
				</div>
			)}
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={`w-full h-full bg-transparent text-sm text-[#1f2937] placeholder:text-[#9aa3b2] outline-none ${leftPad} ${rightPad} ${
					inputClassName || ""
				}`}
			/>
			{rightSlot && (
				<div className="absolute right-1.5 top-1/2 -translate-y-1/2">
					{rightSlot}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
