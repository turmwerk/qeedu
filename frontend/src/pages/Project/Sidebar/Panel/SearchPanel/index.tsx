import React, { useMemo, useState } from "react";
import {
  CloseCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useWorkspace } from "../../../context";
import type { FileTreeNode } from "../../../EditorArea/types";
import { showToast } from "@/ui/Toast";

interface SearchMatch {
  line: number;
  column: number;
  preview: string;
  matchText: string;
  matchIndex: number;
}

interface FileMatch {
  file: FileTreeNode;
  matches: SearchMatch[];
}

const flattenFiles = (node: FileTreeNode): FileTreeNode[] => {
  if (node.type === "file") return [node];
  return (node.children ?? []).flatMap(flattenFiles);
};

const buildPathMatcher = (pattern: string) => {
  const tokens = pattern
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (tokens.length === 0) return null;
  const regexes = tokens.map((token) => {
    const normalized = /[*?]/.test(token) ? token : `*${token}*`;
    const escaped = normalized
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    return new RegExp(`^${escaped}$`, "i");
  });
  return (path: string) => regexes.some((regex) => regex.test(path));
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchRegex = (
  query: string,
  useRegex: boolean,
  matchCase: boolean,
  matchWholeWord: boolean,
): RegExp => {
  const source = useRegex ? query : escapeRegExp(query);
  const wrapped = matchWholeWord ? `\\b${source}\\b` : source;
  const flags = matchCase ? "g" : "gi";
  return new RegExp(wrapped, flags);
};

const ToggleButton: React.FC<{
  active: boolean;
  label: string;
  title: string;
  onClick: () => void;
}> = ({ active, label, title, onClick }) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-5 w-5 items-center justify-center rounded text-[10px] transition ${
        active ? "bg-[#094771] text-white" : "text-[#9d9d9d] hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
};

const SearchPanel: React.FC = () => {
  const { fileTree, openFileTab, updateFileContents, activeTabId } = useWorkspace();
  const [query, setQuery] = useState("");
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replaceValue, setReplaceValue] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [includePattern, setIncludePattern] = useState("");
  const [excludePattern, setExcludePattern] = useState("");

  const { results, totalMatches, error, searchRegex } = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        results: [] as FileMatch[],
        totalMatches: 0,
        error: "",
        searchRegex: null as RegExp | null,
      };
    }

    const includeMatcher = buildPathMatcher(includePattern);
    const excludeMatcher = buildPathMatcher(excludePattern);

    const files = flattenFiles(fileTree).filter((file) => {
      const path = file.path;
      if (includeMatcher && !includeMatcher(path)) return false;
      if (excludeMatcher && excludeMatcher(path)) return false;
      return true;
    });

    let regex: RegExp;
    try {
      regex = buildSearchRegex(trimmed, useRegex, matchCase, matchWholeWord);
    } catch (err) {
      return {
        results: [] as FileMatch[],
        totalMatches: 0,
        error: "正则表达式无效",
        searchRegex: null,
      };
    }

    const nextResults: FileMatch[] = [];
    let matchCount = 0;

    files.forEach((file) => {
      const content = file.content ?? "";
      if (!content) return;
      const lines = content.split(/\r?\n/);
      const matches: SearchMatch[] = [];

      lines.forEach((line, index) => {
        if (!line) return;
        regex.lastIndex = 0;
        let match = regex.exec(line);
        while (match) {
          const matchText = match[0] ?? "";
          if (matchText === "") {
            regex.lastIndex += 1;
            match = regex.exec(line);
            continue;
          }
          const matchIndex = match.index;
          matches.push({
            line: index + 1,
            column: matchIndex + 1,
            preview: line,
            matchText,
            matchIndex,
          });
          matchCount += 1;
          match = regex.exec(line);
        }
      });

      if (matches.length > 0) {
        nextResults.push({ file, matches });
      }
    });

    return { results: nextResults, totalMatches: matchCount, error: "", searchRegex: regex };
  }, [
    excludePattern,
    fileTree,
    includePattern,
    matchCase,
    matchWholeWord,
    query,
    useRegex,
  ]);

  const replaceInContent = (content: string) => {
    if (!searchRegex) return { next: content, count: 0 };
    const regex = new RegExp(searchRegex.source, searchRegex.flags);
    let count = 0;
    const next = content.replace(regex, () => {
      count += 1;
      return replaceValue;
    });
    return { next, count };
  };

  const handleReplace = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      showToast("请先输入搜索内容");
      return;
    }
    if (error) {
      showToast(error);
      return;
    }
    const targetFile =
      (activeTabId
        ? results.find((result) => result.file.path === activeTabId)?.file
        : null) ?? results[0]?.file;
    if (!targetFile) {
      showToast("没有可替换的结果");
      return;
    }
    const { next, count } = replaceInContent(targetFile.content ?? "");
    if (count === 0) {
      showToast("没有找到可替换的内容");
      return;
    }
    updateFileContents([{ path: targetFile.path, content: next }]);
    showToast(`已替换 ${count} 处`);
  };

  const handleReplaceAll = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      showToast("请先输入搜索内容");
      return;
    }
    if (error) {
      showToast(error);
      return;
    }
    let replacedFiles = 0;
    let replacedCount = 0;
    const updates = results
      .map((result) => {
        const { next, count } = replaceInContent(result.file.content ?? "");
        if (count === 0) return null;
        replacedFiles += 1;
        replacedCount += count;
        return { path: result.file.path, content: next };
      })
      .filter(Boolean) as { path: string; content: string }[];

    if (updates.length === 0) {
      showToast("没有找到可替换的内容");
      return;
    }
    updateFileContents(updates);
    showToast(`已替换 ${replacedCount} 处，涉及 ${replacedFiles} 个文件`);
  };

  const replaceDisabled = !query.trim() || !!error;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#3c3c3c] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc]">
        <span>搜索</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={showFilters ? "收起筛选" : "展开筛选"}
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex h-6 w-6 items-center justify-center rounded text-xs transition ${
              showFilters ? "bg-white/10 text-white" : "text-[#9d9d9d] hover:bg-white/10"
            }`}
          >
            <FilterOutlined />
          </button>
          <button
            type="button"
            title={replaceOpen ? "隐藏替换" : "显示替换"}
            onClick={() => setReplaceOpen((prev) => !prev)}
            className={`flex h-6 w-6 items-center justify-center rounded text-xs transition ${
              replaceOpen ? "bg-white/10 text-white" : "text-[#9d9d9d] hover:bg-white/10"
            }`}
          >
            <SwapOutlined />
          </button>
          <button
            type="button"
            title="清空搜索"
            onClick={() => {
              setQuery("");
              setReplaceValue("");
            }}
            className="flex h-6 w-6 items-center justify-center rounded text-xs text-[#9d9d9d] transition hover:bg-white/10"
          >
            <CloseCircleOutlined />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-[#2d2d2d] px-4 py-3 text-xs">
        <div className="flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-2 py-1">
          <SearchOutlined className="text-[#9d9d9d]" />
          <input
            className="flex-1 bg-transparent text-xs text-[#cccccc] placeholder:text-[#6b6b6b] focus:outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="在文件中搜索"
          />
          <div className="flex items-center gap-1">
            <ToggleButton
              active={matchCase}
              label="Aa"
              title="区分大小写"
              onClick={() => setMatchCase((prev) => !prev)}
            />
            <ToggleButton
              active={matchWholeWord}
              label="W"
              title="全字匹配"
              onClick={() => setMatchWholeWord((prev) => !prev)}
            />
            <ToggleButton
              active={useRegex}
              label=".*"
              title="使用正则表达式"
              onClick={() => setUseRegex((prev) => !prev)}
            />
          </div>
        </div>

        {replaceOpen && (
          <div className="flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-2 py-1">
            <SwapOutlined className="text-[#9d9d9d]" />
            <input
              className="flex-1 bg-transparent text-xs text-[#cccccc] placeholder:text-[#6b6b6b] focus:outline-none"
              value={replaceValue}
              onChange={(event) => setReplaceValue(event.target.value)}
              placeholder="替换为"
            />
            <button
              type="button"
              onClick={handleReplace}
              disabled={replaceDisabled}
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px] text-[#cccccc] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-[#666666]"
            >
              替换
            </button>
            <button
              type="button"
              onClick={handleReplaceAll}
              disabled={replaceDisabled}
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px] text-[#cccccc] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-[#666666]"
            >
              全部替换
            </button>
          </div>
        )}

        {showFilters && (
          <div className="grid grid-cols-1 gap-2 text-[11px] text-[#9d9d9d]">
            <label className="flex items-center gap-2">
              <span className="w-16">包含</span>
              <input
                className="flex-1 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-2 py-1 text-xs text-[#cccccc] placeholder:text-[#6b6b6b] focus:outline-none"
                value={includePattern}
                onChange={(event) => setIncludePattern(event.target.value)}
                placeholder="例如：src/*.py"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="w-16">排除</span>
              <input
                className="flex-1 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-2 py-1 text-xs text-[#cccccc] placeholder:text-[#6b6b6b] focus:outline-none"
                value={excludePattern}
                onChange={(event) => setExcludePattern(event.target.value)}
                placeholder="例如：node_modules"
              />
            </label>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {query.trim() === "" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6b6b6b]">
            <SearchOutlined className="text-3xl" />
            <p className="text-xs">输入搜索内容</p>
          </div>
        ) : error ? (
          <div className="px-4 py-3 text-xs text-[#f48771]">{error}</div>
        ) : (
          <div className="flex flex-col gap-2 px-2 py-2 text-xs text-[#cccccc]">
            <div className="px-2 text-[11px] text-[#9d9d9d]">
              在 {results.length} 个文件中找到 {totalMatches} 个结果
            </div>
            {results.length === 0 ? (
              <div className="px-2 text-[11px] text-[#6b6b6b]">没有找到结果</div>
            ) : (
              results.map((result) => (
                <div key={result.file.path} className="rounded bg-[#1f1f1f]">
                  <div className="flex items-center justify-between border-b border-[#2d2d2d] px-3 py-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#094771] px-1.5 py-0.5 text-[10px] text-white">
                        {result.matches.length}
                      </span>
                      <span className="font-medium text-[#e5e5e5]">
                        {result.file.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6b6b6b]">
                      {result.file.path}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {result.matches.map((match, idx) => {
                      const before = match.preview.slice(0, match.matchIndex);
                      const highlight = match.preview.slice(
                        match.matchIndex,
                        match.matchIndex + match.matchText.length,
                      );
                      const after = match.preview.slice(
                        match.matchIndex + match.matchText.length,
                      );
                      return (
                        <button
                          key={`${match.line}-${match.column}-${idx}`}
                          type="button"
                          onClick={() => openFileTab(result.file)}
                          className="flex w-full items-start gap-3 px-3 py-1.5 text-left text-[11px] text-[#cccccc] transition hover:bg-white/5"
                        >
                          <span className="w-12 shrink-0 text-[10px] text-[#9d9d9d]">
                            {match.line}:{match.column}
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {before}
                            <span className="rounded bg-[#264f78] px-0.5 text-white">
                              {highlight}
                            </span>
                            {after}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
