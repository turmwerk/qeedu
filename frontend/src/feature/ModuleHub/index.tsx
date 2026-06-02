import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import ModuleCard from "./ModuleCard";
import type { Feature } from "./types";
import SearchBar from "@/ui/SearchBar";
import { normalizeSearchText } from "@/utils/search/text";
import type { GlobalSearchEntry } from "@/utils/search/global";
import Card from "@/ui/Card";

export type { Feature } from "./types";

// 专门处理 GlobalSearchEntry，只提取有意义的字段
const buildGlobalSearchEntryText = (entry: GlobalSearchEntry) => {
  const parts: string[] = [
    entry.title,
    entry.desc,
    entry.scope,
    ...(entry.keywords ?? []),
  ];
  return normalizeSearchText(parts.join(" "));
};

type Props = {
  headline?: string;
  subtitle?: string;
  features: Feature[];
  /**
   * Custom card renderer. When provided it is called for every feature item
   * instead of the default <ModuleCard>. Useful for sub-pages that need a
   * different card style (e.g. stacked tutorial cards).
   */
  renderFeature?: (item: Feature) => React.ReactNode;
  /**
   * Tailwind grid-cols class applied to the card grid.
   * Defaults to `"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"` so module hubs
   * render one card per row on mobile and three cards per row on desktop.
   * Pass e.g. `"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"` for tutorial grids.
   */
  gridCols?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  features,
  renderFeature,
  gridCols,
  searchable = true,
  searchPlaceholder = "搜索模块、关键词或入口",
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const deferredSearchValue = React.useDeferredValue(searchValue);
  const normalizedSearchValue = normalizeSearchText(deferredSearchValue);

  // 计算可见的项目：无搜索时显示features，搜索时显示匹配的深层条目
  const visibleItems = React.useMemo(() => {
    if (!normalizedSearchValue) {
      // 无搜索时显示原始 features
      return features.map(feature => ({ type: 'feature' as const, data: feature }));
    }

    // 搜索时收集所有匹配的深层条目
    const matchedEntries: Array<{ type: 'entry', data: GlobalSearchEntry }> = [];

    features.forEach(feature => {
      if (feature.searchIndex && Array.isArray(feature.searchIndex)) {
        (feature.searchIndex as GlobalSearchEntry[]).forEach(entry => {
          const entrySearchText = buildGlobalSearchEntryText(entry);
          if (entrySearchText.includes(normalizedSearchValue)) {
            matchedEntries.push({ type: 'entry', data: entry });
          }
        });
      }
    });

    return matchedEntries;
  }, [features, normalizedSearchValue]);

  // 根据原始卡片总数决定布局，避免搜索过滤后打乱四卡页的固定两列结构
  const getGridCols = () => {
    if (gridCols) {
      return gridCols; // 如果手动指定了 gridCols，则使用指定的值
    }

    const featuresCount = features.length;
    // 当只有 2 个或 4 个卡片时，移动端单列，桌面保持每行 2 个
    if (featuresCount === 2 || featuresCount === 4) {
      return "grid-cols-1 md:grid-cols-2";
    }

    // 其他情况使用默认布局：移动端 1 列，桌面端 3 列
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };
  return (
    <div className="module-hub-section relative w-full max-w-full overflow-x-hidden" data-oid="ntkw4hz">
      <div className="pt-6 pb-6 sm:pt-16 sm:pb-16 px-0 sm:px-8 text-[#444] w-full relative z-10" data-oid="w:tm0qp">
        <div
          className="module-hub-shell bg-transparent px-2 sm:px-[60px] pt-[8px] pb-[8px] w-full sm:w-[85%] max-w-[1120px] shadow-none flex flex-col gap-5 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          {headline && (
            <h1
              className="m-0 px-1 font-black text-[var(--brand-blue)] text-center relative z-[1] text-[30px] sm:text-[40px] leading-tight break-words"
              data-oid="x_3t9uw"
            >
              {headline}
            </h1>
          )}
          {subtitle && (
            <div
              className="px-1 text-[var(--brand-muted)] text-[14px] sm:text-[16px] tracking-[1px] sm:tracking-[3px] text-center relative z-[1] break-words"
              data-oid="1y85vfz"
            >
              {subtitle}
            </div>
          )}
          {searchable && features.length > 0 && (
            <div className="w-full">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder={searchPlaceholder}
                className="w-full"
                leftSlot={
                  <SearchOutlined className="text-[var(--brand-blue)]" />
                }
              />
            </div>
          )}
          <div className={`module-hub-grid grid gap-x-3 gap-y-3 sm:gap-x-10 sm:gap-y-10 relative z-[1] min-w-0 ${getGridCols()}`} data-oid="offsvqz">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => {
                if (item.type === 'feature') {
                  // 渲染 Feature 卡片
                  const feature = item.data;
                  return renderFeature ? (
                    <React.Fragment key={feature.key}>
                      {renderFeature(feature)}
                    </React.Fragment>
                  ) : (
                    <ModuleCard
                      key={feature.key}
                      title={feature.title}
                      desc={feature.desc}
                      to={feature.to as string}
                      icon={feature.icon}
                      details={feature.details}
                      subLinks={feature.subLinks}
                    />
                  );
                } else {
                  // 渲染 GlobalSearchEntry 卡片
                  const entry = item.data;
                  return (
                    <Card
                      key={entry.key}
                      iconLayout="inline"
                      title={entry.title}
                      titleLink={entry.to}
                      desc={entry.desc}
                      details={entry.scope ? [entry.scope] : undefined}
                      level={entry.kind === 'module' ? '模块' : '页面'}
                      className="!px-7 !py-6 hover:!-translate-y-1.5 hover:!bg-white/[0.74] dark:hover:!bg-white/[0.16] hover:!shadow-[0_14px_40px_rgba(104,86,180,0.22),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.42)] dark:hover:!shadow-[0_18px_44px_rgba(0,0,0,0.60),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.10)]"
                    />
                  );
                }
              })
            ) : (
              <div className="col-span-full rounded-[24px] bg-white/70 px-6 py-8 text-center text-[15px] leading-7 text-[#67748a] shadow-[0_8px_30px_rgba(120,90,200,0.10),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[32px] dark:bg-white/10 dark:text-[#dbe5f3]">
                没有找到匹配的模块，换个学院、专业、关键词或入口名称再试试。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
export { ModuleCard };
