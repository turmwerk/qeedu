import React, { useState } from "react";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "@/ui/Button";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	leftSlot?: React.ReactNode;
	rightSlot?: React.ReactNode;
	collapsible?: boolean;
	defaultExpanded?: boolean;
	onExpandChange?: (expanded: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	value,
	onChange,
	placeholder = "搜索",
	className,
	inputClassName,
	leftSlot,
	rightSlot,
	collapsible = false,
	defaultExpanded = true,
	onExpandChange,
}) => {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const leftPad = leftSlot ? "pl-9" : "pl-3";
	const rightPad = rightSlot ? "pr-9" : "pr-3";
	const iconButtonClass =
		"flex items-center justify-center w-9 h-9 border border-transparent dark:border-white/[0.45] bg-white dark:bg-white/10 text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)]";

	const inputNode = (
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

	if (!collapsible) {
		return inputNode;
	}

	const toggle = () => {
		const next = !expanded;
		setExpanded(next);
		onExpandChange?.(next);
	};

	const hintText = `${placeholder}（输入即搜索）`;

	return (
		<div className="relative flex items-center justify-end h-9">
			<div
				className={`absolute right-9 top-0 h-9 overflow-hidden transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
					expanded
						? "w-[160px] sm:w-[260px] opacity-100 translate-x-0"
						: "w-0 opacity-0 -translate-x-2"
				}`}
			>
				<SearchBar
					value={value}
					onChange={onChange}
					placeholder={hintText}
					className="rounded-l-xl rounded-r-none border-r-0"
					leftSlot={<SearchOutlined className="text-[var(--brand-blue)]" />}
				/>
			</div>
			<Button
				className={`${iconButtonClass} rounded-l-none rounded-r-xl`}
				onClick={toggle}
				aria-label={expanded ? "收起搜索" : "展开搜索"}
			>
				{expanded ? <LeftOutlined /> : <SearchOutlined />}
			</Button>
		</div>
	);
};

export default SearchBar;
