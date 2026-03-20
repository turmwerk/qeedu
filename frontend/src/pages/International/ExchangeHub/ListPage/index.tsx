import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { SearchOutlined, FilterOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from "@ant-design/icons";

const ExchangeHubListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("全部");
  const [filterRegion, setFilterRegion] = useState("全部");

  const exchangePrograms = [
    {
      id: "EH-001",
      university: "University of British Columbia",
      country: "Canada",
      region: "北美",
      type: "交换",
      duration: "一学期",
      semester: "2026秋季",
      quota: 6,
      fee: "学费互免",
      requirements: "托福90+ / GPA3.3+",
      deadline: "2024-04-18",
      status: "开放申请",
      featured: true
    },
    {
      id: "EH-002",
      university: "National University of Singapore",
      country: "Singapore",
      region: "亚洲",
      type: "暑校",
      duration: "6周",
      semester: "2026暑期",
      quota: 20,
      fee: "自费",
      requirements: "雅思6.5+ / GPA3.0+",
      deadline: "2024-05-10",
      status: "开放申请",
      featured: false
    },
    {
      id: "EH-003",
      university: "KU Leuven",
      country: "Belgium",
      region: "欧洲",
      type: "联合培养",
      duration: "一年",
      semester: "2026秋季",
      quota: 3,
      fee: "部分资助",
      requirements: "托福100+ / GPA3.5+",
      deadline: "2024-06-15",
      status: "开放申请",
      featured: false
    },
    {
      id: "EH-004",
      university: "University of Oxford",
      country: "UK",
      region: "欧洲",
      type: "短期访学",
      duration: "3个月",
      semester: "2026春季",
      quota: 4,
      fee: "自费",
      requirements: "雅思7.0+ / GPA3.6+",
      deadline: "2024-03-30",
      status: "即将截止",
      featured: true
    },
    {
      id: "EH-005",
      university: "University of Tokyo",
      country: "Japan",
      region: "亚洲",
      type: "交换",
      duration: "一学期",
      semester: "2026春季",
      quota: 8,
      fee: "学费互免",
      requirements: "日语N2 / GPA3.2+",
      deadline: "2024-11-30",
      status: "即将开放",
      featured: false
    },
  ];

  const programTypes = ["全部", "交换", "暑校", "联合培养", "短期访学"];
  const regions = ["全部", "北美", "欧洲", "亚洲", "大洋洲"];

  const filteredPrograms = exchangePrograms.filter(
    (program) =>
      (filterType === "全部" || program.type === filterType) &&
      (filterRegion === "全部" || program.region === filterRegion) &&
      (searchTerm === "" ||
       program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
       program.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "开放申请": return "bg-green-100 text-green-700";
      case "即将截止": return "bg-red-100 text-red-700";
      case "即将开放": return "bg-blue-100 text-blue-700";
      case "已截止": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Exchange Programs</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            交换与访学项目
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/exchange-hub/ListPage")}
        >
          浏览项目中心
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["总项目数", filteredPrograms.length, "个可申请项目"],
            ["开放申请", filteredPrograms.filter(p => p.status === "开放申请").length, "正在招生"],
            ["重点推荐", filteredPrograms.filter(p => p.featured).length, "精选项目"],
            ["学费互免", filteredPrograms.filter(p => p.fee === "学费互免").length, "费用优势"],
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
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 lg:w-80">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="搜索学校、国家或项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe1f3] bg-white/76 py-3 pl-10 pr-4 text-[15px] focus:border-[var(--brand-blue)] focus:outline-none dark:border-white/10 dark:bg-white/6"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterOutlined className="text-[#94a3b8]" />
            <div className="flex flex-wrap gap-1">
              {programTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                    filterType === type
                      ? "bg-[var(--brand-blue)] text-white"
                      : "border border-[#dbe1f3] bg-white/76 text-[#67748a] hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex flex-wrap gap-1">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setFilterRegion(region)}
                  className={`rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                    filterRegion === region
                      ? "bg-[var(--brand-blue)] text-white"
                      : "border border-[#dbe1f3] bg-white/76 text-[#67748a] hover:bg-gray-50"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className={`cursor-pointer rounded-[24px] border p-6 transition-all hover:shadow-lg ${
                program.featured
                  ? "border-[var(--brand-blue)] bg-gradient-to-r from-blue-50 to-indigo-50"
                  : "border-[#dbe1f3] bg-white/76"
              } dark:border-white/10 dark:bg-white/6`}
              onClick={() => navigate(`/international/exchange-hub/detail/${program.id}`)}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <ShowcaseTag>{program.country}</ShowcaseTag>
                    <ShowcaseTag tone="gray">{program.type}</ShowcaseTag>
                    {program.featured && <ShowcaseTag tone="blue">推荐</ShowcaseTag>}
                  </div>
                  <div className="text-[20px] font-black text-[#243246] dark:text-white">
                    {program.university}
                  </div>
                </div>
                <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(program.status)}`}>
                  {program.status}
                </div>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-[#94a3b8]" />
                  <span className="text-[14px] text-[#67748a] dark:text-[#dbe5f3]">
                    {program.semester} · {program.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-[#94a3b8]" />
                  <span className="text-[14px] text-[#67748a] dark:text-[#dbe5f3]">
                    名额 {program.quota} 个
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarOutlined className="text-[#94a3b8]" />
                  <span className="text-[14px] text-[#67748a] dark:text-[#dbe5f3]">
                    {program.fee}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#67748a] dark:text-[#dbe5f3]">
                    截止 {program.deadline}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[13px] font-semibold text-[#94a3b8] mb-1">申请要求</div>
                <div className="text-[14px] text-[#67748a] dark:text-[#dbe5f3]">
                  {program.requirements}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="rounded-[16px] bg-[var(--brand-blue)] px-4 py-2 text-[13px] font-semibold text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/international/exchange-hub/detail/${program.id}`);
                  }}
                >
                  查看详情
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">🏫</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的项目</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ExchangeHubListPage;
