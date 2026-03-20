import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const WelcomePortalListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("全部");

  const supportCases = [
    {
      id: "WP-2024-001",
      name: "Anna Lee",
      country: "Singapore",
      program: "Exchange Student · Computing",
      stage: "报到注册",
      arrival: "2026-08-25",
      status: "进行中",
      progress: 75,
      priority: "中等",
      lastUpdate: "今天 11:30",
    },
    {
      id: "WP-2024-002",
      name: "James Wilson",
      country: "Canada",
      program: "Master · Business",
      stage: "签证材料",
      arrival: "2026-09-01",
      status: "材料审核",
      progress: 45,
      priority: "高",
      lastUpdate: "昨天 16:20",
    },
    {
      id: "WP-2024-003",
      name: "Marie Dubois",
      country: "France",
      program: "PhD · Physics",
      stage: "住宿校园",
      arrival: "2026-08-20",
      status: "已完成",
      progress: 100,
      priority: "低",
      lastUpdate: "3天前",
    },
    {
      id: "WP-2024-004",
      name: "Takeshi Yamada",
      country: "Japan",
      program: "Exchange · Engineering",
      stage: "行前准备",
      arrival: "2026-09-10",
      status: "待联系",
      progress: 20,
      priority: "中等",
      lastUpdate: "1周前",
    },
  ];

  const stages = ["全部", "签证材料", "行前准备", "报到注册", "住宿校园", "语言适应"];

  const filteredCases = supportCases.filter(
    (case_) =>
      (filterStage === "全部" || case_.stage === filterStage) &&
      (searchTerm === "" ||
       case_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       case_.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
       case_.program.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string, progress: number) => {
    if (progress === 100) return "bg-green-100 text-green-700";
    if (status === "材料审核") return "bg-blue-100 text-blue-700";
    if (status === "进行中") return "bg-orange-100 text-orange-700";
    if (status === "待联系") return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高": return "bg-red-100 text-red-700";
      case "中等": return "bg-yellow-100 text-yellow-700";
      case "低": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">International Student Support</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            来华留学生支持档案
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/welcome-portal/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建支持档案
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["总计档案", filteredCases.length, "个支持案例"],
            ["进行中", filteredCases.filter(c => c.progress < 100 && c.status !== "待联系").length, "需要跟进"],
            ["本周到校", filteredCases.filter(c => c.stage === "报到注册").length, "报到注册阶段"],
            ["高优先级", filteredCases.filter(c => c.priority === "高").length, "紧急处理"],
          ].map(([label, value, desc]) => (
            <div key={label} className="rounded-[24px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
              <div className="mt-3 text-[32px] font-black text-[#243246] dark:text-white">{value}</div>
              <div className="mt-2 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="搜索学生姓名、国家或项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe1f3] bg-white/76 py-3 pl-10 pr-4 text-[15px] focus:border-[var(--brand-blue)] focus:outline-none dark:border-white/10 dark:bg-white/6"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-[#94a3b8]" />
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                  filterStage === stage
                    ? "bg-[var(--brand-blue)] text-white"
                    : "border border-[#dbe1f3] bg-white/76 text-[#67748a] hover:bg-gray-50"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/welcome-portal/detail/${case_.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{case_.name}</div>
                    <ShowcaseTag>{case_.country}</ShowcaseTag>
                    <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${getPriorityColor(case_.priority)}`}>
                      {case_.priority}优先
                    </div>
                  </div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{case_.program}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">阶段:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{case_.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">到校:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{case_.arrival}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">更新:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{case_.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(case_.status, case_.progress)}`}>
                    {case_.status}
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-black text-[#243246] dark:text-white">{case_.progress}%</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--brand-blue)] transition-all duration-300"
                        style={{ width: `${case_.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">📋</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的支持档案</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WelcomePortalListPage;
