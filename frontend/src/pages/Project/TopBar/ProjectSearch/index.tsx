import React from "react";
import { SearchOutlined } from "@ant-design/icons";

interface ProjectSearchProps {
  projectName: string;
  onClick: () => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ projectName, onClick }) => {
  return (
    <button
      className="mx-auto flex w-64 items-center gap-2 rounded border border-[#454545] bg-[#3c3c3c] px-3 py-1 text-xs text-[#9d9d9d] transition hover:border-[#007acc]"
      onClick={onClick}
      title="快速打开（Ctrl+P）"
      type="button"
    >
      <SearchOutlined className="text-xs" />
      <span className="truncate">{projectName}</span>
    </button>
  );
};

export default ProjectSearch;
