import React, { useState } from "react";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import BaseSearchBar from "@/components/SearchBar";

interface Props {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	defaultExpanded?: boolean;
	onExpandChange?: (expanded: boolean) => void;
}

const SearchBar: React.FC<Props> = ({
	value,
	onChange,
	placeholder = "搜索",
	defaultExpanded = true,
	onExpandChange,
}) => {
	const [expanded, setExpanded] = useState(defaultExpanded);

	const toggle = () => {
		const next = !expanded;
		setExpanded(next);
		onExpandChange?.(next);
	};

	const iconButtonClass =
		"flex items-center justify-center w-9 h-9 border border-transparent dark:border-white/[0.45] bg-white dark:bg-white/10 text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)]";
	const staticIconClass = "text-[var(--brand-blue)]";
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
				<BaseSearchBar
					value={value}
					onChange={onChange}
					placeholder={hintText}
					className="rounded-l-xl rounded-r-none border-r-0"
					leftSlot={<SearchOutlined className={staticIconClass} />}
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
