import React from "react";
import SyllabusSearchBar from "@/pages/Teaching/Syllabus/components/SearchBar";

interface Props {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	defaultExpanded?: boolean;
}

const SearchBar: React.FC<Props> = (props) => {
	return <SyllabusSearchBar {...props} />;
};

export default SearchBar;
