import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const PreDepartureListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("全部");

  const predepartureRecords = [
    {
      id: "PD-2024-001",
      studentName: "李思雨",
      destination: "澳大利亚",
      university: "University of Sydney",
      program: "本科交换 · 商学院",
      departureDate: "2026-07-15",
      preparationStage: "行前指导",
      progress: 75,
      urgentTasks: 2,
      completedTasks: 6,
      totalTasks: 8,
      lastUpdate: "昨天 16:45",
      status: "准备中",
      daysLeft: 45,
    },
    {
      id: "PD-2024-002",
      studentName: "王小明",
      destination: "英国",
      university: "Imperial College London",
      program: "硕士 · 工程学",
      departureDate: "2026-09-20",
      preparationStage: "签证办理",
      progress: 40,
      urgentTasks: 3,
      completedTasks: 3,
      totalTasks: 10,
      lastUpdate: "今天 10:30",
      status: "办理中",
      daysLeft: 112,
    },
    {
      id: "PD-2024-003",
      studentName: "张梅",
      destination: "加拿大",
      university: "University of Toronto",
      program: "博士 · 计算机科学",
      departureDate: "2026-08-30",
      preparationStage: "最终确认",
      progress: 95,
      urgentTasks: 0,
      completedTasks: 9,
      totalTasks: 10,
      lastUpdate: "2天前",
      status: "即将出发",
      daysLeft: 97,
    },
    {
      id: "PD-2024-004",
      studentName: "陈浩",
      destination: "美国",
      university: "Stanford University",
      program: "本科交换 · 计算机科学",
      departureDate: "2026-08-15",
      preparationStage: "材料准备",
      progress: 30,
      urgentTasks: 4,
      completedTasks: 2,
      totalTasks: 8,
      lastUpdate: "3天前",
      status: "起步阶段",
      daysLeft: 82,
    },
  ];

  const stages = ["全部", "材料准备", "签证办理", "行前指导", "最终确认"];

  const filteredRecords = predepartureRecords.filter(
    (record) =>
      (filterStage === "全部" || record.preparationStage === filterStage) &&
      (searchTerm === "" ||
       record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.university.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "即将出发": return "bg-green-100 text-green-700";
      case "准备中": return "bg-blue-100 text-blue-700";
      case "办理中": return "bg-orange-100 text-orange-700";
      case "起步阶段": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-blue-600";
    if (progress >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getUrgentTasksColor = (tasks: number) => {
    if (tasks === 0) return "text-green-600";
    if (tasks <= 2) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Pre-Departure Guidance</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            行前准备指导管理
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/pre-departure/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建准备档案
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["准备学生", filteredRecords.length, "名学生"],
            ["即将出发", filteredRecords.filter(r => r.daysLeft <= 60).length, "60天内出发"],
            ["需要关注", filteredRecords.filter(r => r.urgentTasks > 2 || r.progress < 50).length, "进度滞后"],
            ["准备完成", filteredRecords.filter(r => r.progress >= 90).length, "进度≥90%"],
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
                placeholder="搜索学生姓名、目的地或院校..."
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
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/pre-departure/detail/${record.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{record.studentName}</div>
                    <ShowcaseTag>{record.destination}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{record.preparationStage}</ShowcaseTag>
                    <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${
                      record.daysLeft <= 30 ? "bg-red-100 text-red-700" :
                      record.daysLeft <= 60 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {record.daysLeft}天后出发
                    </div>
                  </div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
                    {record.university} · {record.program}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">出发日期:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.departureDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">任务进度:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">
                        {record.completedTasks}/{record.totalTasks} 已完成
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">最近更新:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.lastUpdate}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">紧急任务:</span>
                      <span className={`text-[14px] font-semibold ${getUrgentTasksColor(record.urgentTasks)}`}>
                        {record.urgentTasks} 项
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(record.status)}`}>
                    {record.status}
                  </div>
                  <div className="text-right">
                    <div className={`text-[24px] font-black ${getProgressColor(record.progress)}`}>
                      {record.progress}%
                    </div>
                    <div className="text-[13px] text-[#94a3b8]">完成度</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          record.progress >= 80 ? 'bg-green-500' :
                          record.progress >= 50 ? 'bg-blue-500' :
                          record.progress >= 30 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${record.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">✈️</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的准备档案</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PreDepartureListPage;
