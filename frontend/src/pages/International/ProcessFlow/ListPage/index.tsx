import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const ProcessFlowListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("全部");

  const applicationFlows = [
    {
      id: "PF-2024-001",
      student: "张同学",
      program: "UBC 2026秋季交换",
      type: "交换项目",
      country: "Canada",
      stage: "院系审批",
      progress: 65,
      deadline: "2024-04-18",
      daysLeft: 12,
      priority: "中等",
      lastUpdate: "今天 10:30",
      status: "进行中"
    },
    {
      id: "PF-2024-002",
      student: "李同学",
      program: "NUS 暑期学校",
      type: "暑期项目",
      country: "Singapore",
      stage: "材料准备",
      progress: 35,
      deadline: "2024-05-10",
      daysLeft: 45,
      priority: "低",
      lastUpdate: "2天前",
      status: "进行中"
    },
    {
      id: "PF-2024-003",
      student: "王同学",
      program: "KU Leuven 联合培养",
      type: "联合培养",
      country: "Belgium",
      stage: "签证申请",
      progress: 85,
      deadline: "2024-06-15",
      daysLeft: 80,
      priority: "高",
      lastUpdate: "昨天 15:20",
      status: "进行中"
    },
    {
      id: "PF-2024-004",
      student: "赵同学",
      program: "MIT 夏季研究",
      type: "研究项目",
      country: "USA",
      stage: "已完成",
      progress: 100,
      deadline: "2024-03-15",
      daysLeft: 0,
      priority: "低",
      lastUpdate: "1周前",
      status: "已申请"
    },
    {
      id: "PF-2024-005",
      student: "陈同学",
      program: "Oxford 短期访学",
      type: "访学项目",
      country: "UK",
      stage: "推荐信收集",
      progress: 45,
      deadline: "2024-04-01",
      daysLeft: 3,
      priority: "紧急",
      lastUpdate: "今天 09:15",
      status: "紧急"
    },
  ];

  const projectTypes = ["全部", "交换项目", "暑期项目", "联合培养", "访学项目", "研究项目"];

  const filteredFlows = applicationFlows.filter(
    (flow) =>
      (filterType === "全部" || flow.type === filterType) &&
      (searchTerm === "" ||
       flow.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
       flow.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
       flow.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string, priority: string) => {
    if (status === "已申请") return "bg-green-100 text-green-700";
    if (priority === "紧急") return "bg-red-100 text-red-700";
    if (status === "进行中") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "紧急": return "bg-red-100 text-red-700";
      case "高": return "bg-orange-100 text-orange-700";
      case "中等": return "bg-yellow-100 text-yellow-700";
      case "低": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Application Workflows</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            申请流程管理
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/process-flow/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          创建申请流程
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["进行中项目", filteredFlows.filter(f => f.status === "进行中").length, "需要跟进"],
            ["紧急截止", filteredFlows.filter(f => f.daysLeft <= 7 && f.status !== "已申请").length, "一周内截止"],
            ["本月完成", filteredFlows.filter(f => f.status === "已申请").length, "已提交申请"],
            ["平均进度", Math.round(filteredFlows.filter(f => f.status !== "已申请").reduce((sum, f) => sum + f.progress, 0) / filteredFlows.filter(f => f.status !== "已申请").length) || 0, "%"],
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
                placeholder="搜索学生、项目或国家..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe1f3] bg-white/76 py-3 pl-10 pr-4 text-[15px] focus:border-[var(--brand-blue)] focus:outline-none dark:border-white/10 dark:bg-white/6"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-[#94a3b8]" />
            {projectTypes.map((type) => (
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
        </div>

        <div className="space-y-4">
          {filteredFlows.map((flow) => (
            <div
              key={flow.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/process-flow/detail/${flow.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{flow.student}</div>
                    <ShowcaseTag>{flow.country}</ShowcaseTag>
                    <ShowcaseTag tone="gray">{flow.type}</ShowcaseTag>
                    <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${getPriorityColor(flow.priority)}`}>
                      {flow.priority}
                    </div>
                  </div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{flow.program}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">阶段:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{flow.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {flow.daysLeft > 0 ? (
                        <>
                          <ClockCircleOutlined className="text-[#94a3b8]" />
                          <span className="text-[14px] text-[#243246] dark:text-white">{flow.daysLeft}天后截止</span>
                        </>
                      ) : flow.status === "已申请" ? (
                        <>
                          <span className="text-[14px] text-green-600">✓ 已完成</span>
                        </>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">更新:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{flow.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(flow.status, flow.priority)}`}>
                    {flow.status}
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-black text-[#243246] dark:text-white">{flow.progress}%</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(flow.progress)} transition-all duration-300`}
                        style={{ width: `${flow.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {flow.daysLeft <= 7 && flow.status !== "已申请" && (
                <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-red-50 px-3 py-2">
                  <ExclamationCircleOutlined className="text-red-500" />
                  <span className="text-[13px] font-semibold text-red-700">
                    截止时间临近，请优先处理！
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFlows.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">📋</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的申请流程</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProcessFlowListPage;
