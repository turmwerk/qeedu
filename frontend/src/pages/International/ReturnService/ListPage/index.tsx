import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const ReturnServiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("全部");

  const returnServiceRecords = [
    {
      id: "RS-2024-001",
      studentName: "陈大伟",
      exchangeUniversity: "MIT",
      exchangeProgram: "博士联合培养 · 机械工程",
      exchangePeriod: "2023-09 至 2025-08",
      returnDate: "2025-08-20",
      serviceStage: "后续跟踪",
      serviceProgress: 80,
      status: "服务中",
      lastUpdate: "昨天 15:45",
      urgentTasks: 1,
      completedTasks: 6,
      totalTasks: 8,
      adaptationLevel: "良好",
    },
    {
      id: "RS-2024-002",
      studentName: "王晓雪",
      exchangeUniversity: "Oxford University",
      exchangeProgram: "硕士交换 · 文学院",
      exchangePeriod: "2024-09 至 2025-06",
      returnDate: "2025-06-15",
      serviceStage: "学位认证",
      serviceProgress: 65,
      status: "认证中",
      lastUpdate: "今天 10:30",
      urgentTasks: 2,
      completedTasks: 5,
      totalTasks: 9,
      adaptationLevel: "适应中",
    },
    {
      id: "RS-2024-003",
      studentName: "刘志强",
      exchangeUniversity: "Stanford University",
      exchangeProgram: "博士访学 · 计算机科学",
      exchangePeriod: "2023-01 至 2024-12",
      returnDate: "2024-12-10",
      serviceStage: "服务完成",
      serviceProgress: 100,
      status: "已完成",
      lastUpdate: "1周前",
      urgentTasks: 0,
      completedTasks: 10,
      totalTasks: 10,
      adaptationLevel: "优秀",
    },
    {
      id: "RS-2024-004",
      studentName: "张小慧",
      exchangeUniversity: "University of Melbourne",
      exchangeProgram: "本科交换 · 商学院",
      exchangePeriod: "2024-02 至 2024-11",
      returnDate: "2024-11-20",
      serviceStage: "初期安置",
      serviceProgress: 40,
      status: "安置中",
      lastUpdate: "2天前",
      urgentTasks: 3,
      completedTasks: 3,
      totalTasks: 8,
      adaptationLevel: "需要关注",
    },
  ];

  const statuses = ["全部", "安置中", "认证中", "服务中", "已完成"];

  const filteredRecords = returnServiceRecords.filter(
    (record) =>
      (filterStatus === "全部" || record.status === filterStatus) &&
      (searchTerm === "" ||
       record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.exchangeUniversity.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.exchangeProgram.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "bg-green-100 text-green-700";
      case "服务中": return "bg-blue-100 text-blue-700";
      case "认证中": return "bg-orange-100 text-orange-700";
      case "安置中": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getAdaptationColor = (level: string) => {
    switch (level) {
      case "优秀": return "text-green-600";
      case "良好": return "text-blue-600";
      case "适应中": return "text-orange-600";
      case "需要关注": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600";
    if (progress >= 70) return "text-blue-600";
    if (progress >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getMonthsSinceReturn = (returnDate: string) => {
    const returnTime = new Date(returnDate);
    const now = new Date();
    const diffTime = now.getTime() - returnTime.getTime();
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Return Service Management</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            回国后续服务管理
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/return-service/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建服务档案
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["服务学生", filteredRecords.length, "回国学生"],
            ["新近回国", filteredRecords.filter(r => getMonthsSinceReturn(r.returnDate) <= 3).length, "3个月内"],
            ["需要关注", filteredRecords.filter(r => r.urgentTasks > 2 || r.adaptationLevel === "需要关注").length, "需特殊关怀"],
            ["服务完成", filteredRecords.filter(r => r.status === "已完成").length, "服务结束"],
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
                placeholder="搜索学生姓名、交流院校或项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe1f3] bg-white/76 py-3 pl-10 pr-4 text-[15px] focus:border-[var(--brand-blue)] focus:outline-none dark:border-white/10 dark:bg-white/6"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-[#94a3b8]" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                  filterStatus === status
                    ? "bg-[var(--brand-blue)] text-white"
                    : "border border-[#dbe1f3] bg-white/76 text-[#67748a] hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/return-service/detail/${record.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{record.studentName}</div>
                    <ShowcaseTag>{record.exchangeUniversity}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{record.serviceStage}</ShowcaseTag>
                    {record.urgentTasks > 0 && (
                      <ShowcaseTag tone="orange">{record.urgentTasks}项待处理</ShowcaseTag>
                    )}
                  </div>
                  <div className="mb-3 text-[16px] font-semibold text-[#243246] dark:text-white">{record.exchangeProgram}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">交流期间:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.exchangePeriod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">回国时间:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.returnDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">回国时长:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">
                        {getMonthsSinceReturn(record.returnDate)}个月
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">服务进度:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">
                        {record.completedTasks}/{record.totalTasks} 已完成
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">适应状况:</span>
                      <span className={`text-[14px] font-semibold ${getAdaptationColor(record.adaptationLevel)}`}>
                        {record.adaptationLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">最近更新:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(record.status)}`}>
                    {record.status}
                  </div>
                  <div className="text-right">
                    <div className={`text-[24px] font-black ${getProgressColor(record.serviceProgress)}`}>
                      {record.serviceProgress}%
                    </div>
                    <div className="text-[13px] text-[#94a3b8]">服务完成度</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          record.serviceProgress >= 90 ? 'bg-green-500' :
                          record.serviceProgress >= 70 ? 'bg-blue-500' :
                          record.serviceProgress >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${record.serviceProgress}%` }}
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
            <div className="text-[64px] opacity-20">🏠</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的服务档案</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReturnServiceListPage;
