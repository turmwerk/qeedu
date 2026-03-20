import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const CulturalTrainingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("全部");

  const trainingRecords = [
    {
      id: "CT-2024-001",
      studentName: "赵小美",
      targetCountry: "美国",
      university: "UC Berkeley",
      program: "硕士交换 · 工程学院",
      trainingStage: "跨文化沟通",
      progress: 60,
      currentModule: "沟通技巧",
      trainer: "Sarah Johnson",
      grade: "B+",
      startDate: "2024-05-01",
      expectedCompletion: "2024-06-15",
      status: "培训中",
      lastActivity: "昨天 19:30",
    },
    {
      id: "CT-2024-002",
      studentName: "李子涵",
      targetCountry: "英国",
      university: "Oxford University",
      program: "博士 · 历史学",
      trainingStage: "学术环境适应",
      progress: 85,
      currentModule: "学术写作",
      trainer: "Dr. James Wilson",
      grade: "A-",
      startDate: "2024-04-15",
      expectedCompletion: "2024-06-01",
      status: "接近完成",
      lastActivity: "今天 11:20",
    },
    {
      id: "CT-2024-003",
      studentName: "王思琪",
      targetCountry: "澳大利亚",
      university: "University of Sydney",
      program: "本科交换 · 商学院",
      trainingStage: "基础文化认知",
      progress: 25,
      currentModule: "文化价值观",
      trainer: "Michael Brown",
      grade: "C+",
      startDate: "2024-05-20",
      expectedCompletion: "2024-07-30",
      status: "初期阶段",
      lastActivity: "2天前",
    },
    {
      id: "CT-2024-004",
      studentName: "张雨晨",
      targetCountry: "加拿大",
      university: "University of Toronto",
      program: "硕士 · 计算机科学",
      trainingStage: "职场文化准备",
      progress: 100,
      currentModule: "已完成",
      trainer: "Emily Chen",
      grade: "A",
      startDate: "2024-03-01",
      expectedCompletion: "2024-05-15",
      status: "培训完成",
      lastActivity: "1周前",
    },
  ];

  const regions = ["全部", "美国", "英国", "澳大利亚", "加拿大", "欧洲", "亚洲"];

  const filteredRecords = trainingRecords.filter(
    (record) =>
      (filterRegion === "全部" || record.targetCountry === filterRegion) &&
      (searchTerm === "" ||
       record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.targetCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.university.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "培训完成": return "bg-green-100 text-green-700";
      case "接近完成": return "bg-blue-100 text-blue-700";
      case "培训中": return "bg-orange-100 text-orange-700";
      case "初期阶段": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "text-green-600";
    if (grade.startsWith('B')) return "text-blue-600";
    if (grade.startsWith('C')) return "text-orange-600";
    return "text-gray-600";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600";
    if (progress >= 70) return "text-blue-600";
    if (progress >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Cultural Training</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            文化适应培训管理
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/cultural-training/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建培训档案
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["培训学生", filteredRecords.length, "正在培训"],
            ["优秀学员", filteredRecords.filter(r => r.grade.startsWith('A')).length, "A级成绩"],
            ["即将完成", filteredRecords.filter(r => r.progress >= 80).length, "进度≥80%"],
            ["培训完成", filteredRecords.filter(r => r.status === "培训完成").length, "已结业"],
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
                placeholder="搜索学生姓名、国家或院校..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe1f3] bg-white/76 py-3 pl-10 pr-4 text-[15px] focus:border-[var(--brand-blue)] focus:outline-none dark:border-white/10 dark:bg-white/6"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-[#94a3b8]" />
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

        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/cultural-training/detail/${record.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{record.studentName}</div>
                    <ShowcaseTag>{record.targetCountry}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{record.trainingStage}</ShowcaseTag>
                    <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${getGradeColor(record.grade)}`}>
                      成绩: {record.grade}
                    </div>
                  </div>
                  <div className="mb-3 text-[16px] font-semibold text-[#243246] dark:text-white">{record.university}</div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{record.program}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">当前模块:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.currentModule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">培训师:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.trainer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">预计完成:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.expectedCompletion}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">开始时间:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">最近活动:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{record.lastActivity}</span>
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
                    <div className="text-[13px] text-[#94a3b8]">完成进度</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          record.progress >= 90 ? 'bg-green-500' :
                          record.progress >= 70 ? 'bg-blue-500' :
                          record.progress >= 50 ? 'bg-orange-500' : 'bg-red-500'
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
            <div className="text-[64px] opacity-20">🌍</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的培训档案</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CulturalTrainingListPage;
