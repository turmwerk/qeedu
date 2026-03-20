import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const MatchingLabListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("全部");

  const matchingRecords = [
    {
      id: "ML-2024-001",
      studentName: "张明",
      studentMajor: "计算机科学与技术",
      studentYear: "大三",
      projectTitle: "基于深度学习的自然语言处理系统研发",
      supervisor: "李教授",
      department: "人工智能实验室",
      matchScore: 92,
      status: "待确认",
      matchDate: "今天 11:45",
      projectType: "科研训练",
      researchField: "人工智能",
    },
    {
      id: "ML-2024-002",
      studentName: "王小雨",
      studentMajor: "软件工程",
      studentYear: "大二",
      projectTitle: "移动端智能推荐算法优化",
      supervisor: "陈教授",
      department: "软件学院",
      matchScore: 88,
      status: "已配对",
      matchDate: "昨天 14:20",
      projectType: "实践项目",
      researchField: "移动开发",
    },
    {
      id: "ML-2024-003",
      studentName: "李华",
      studentMajor: "数据科学",
      studentYear: "研一",
      projectTitle: "大数据环境下的用户行为分析",
      supervisor: "赵教授",
      department: "数据科学学院",
      matchScore: 95,
      status: "已完成",
      matchDate: "3天前",
      projectType: "研究生项目",
      researchField: "数据科学",
    },
    {
      id: "ML-2024-004",
      studentName: "刘同学",
      studentMajor: "信息管理",
      studentYear: "大四",
      projectTitle: "企业知识管理系统设计",
      supervisor: "吴教授",
      department: "信息管理学院",
      matchScore: 76,
      status: "匹配中",
      matchDate: "1小时前",
      projectType: "毕业设计",
      researchField: "信息管理",
    },
  ];

  const statuses = ["全部", "匹配中", "待确认", "已配对", "已完成"];

  const filteredRecords = matchingRecords.filter(
    (record) =>
      (filterStatus === "全部" || record.status === filterStatus) &&
      (searchTerm === "" ||
       record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.supervisor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "bg-green-100 text-green-700";
      case "已配对": return "bg-blue-100 text-blue-700";
      case "待确认": return "bg-orange-100 text-orange-700";
      case "匹配中": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Intelligent Matching System</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            学生项目智能配对实验室
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/matching-lab/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建匹配任务
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["总计匹配", filteredRecords.length, "个匹配记录"],
            ["高匹配度", filteredRecords.filter(r => r.matchScore >= 90).length, "匹配度≥90%"],
            ["待处理", filteredRecords.filter(r => r.status === "待确认" || r.status === "匹配中").length, "需要跟进"],
            ["成功配对", filteredRecords.filter(r => r.status === "已配对" || r.status === "已完成").length, "配对成功"],
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
                placeholder="搜索学生姓名、项目或导师..."
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
              onClick={() => navigate(`/international/matching-lab/detail/${record.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{record.studentName}</div>
                    <ShowcaseTag>{record.studentMajor}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{record.studentYear}</ShowcaseTag>
                  </div>
                  <div className="mb-3 text-[16px] font-semibold text-[#243246] dark:text-white">{record.projectTitle}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">导师:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">院系:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">类型:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.projectType}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">研究领域:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.researchField}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">匹配时间:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.matchDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(record.status)}`}>
                    {record.status}
                  </div>
                  <div className="text-right">
                    <div className={`text-[24px] font-black ${getScoreColor(record.matchScore)}`}>{record.matchScore}%</div>
                    <div className="text-[13px] text-[#94a3b8]">匹配度</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">🔄</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配记录</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MatchingLabListPage;
