import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const AbroadLifeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("全部");

  const abroadStudents = [
    {
      id: "AL-2024-001",
      studentName: "王小花",
      university: "University College London",
      country: "英国",
      program: "硕士交换 · 计算机科学",
      duration: "2025-09 至 2026-06",
      currentSemester: "第二学期",
      accommodation: "学校宿舍",
      status: "学习顺利",
      adaptationLevel: 85,
      lastContact: "今天 09:15",
      supportLevel: "常规关怀",
      emergencyContact: "王妈妈",
    },
    {
      id: "AL-2024-002",
      studentName: "李明",
      university: "Stanford University",
      country: "美国",
      program: "PhD · 人工智能",
      duration: "2023-09 至 2027-06",
      currentSemester: "第六学期",
      accommodation: "校外公寓",
      status: "压力较大",
      adaptationLevel: 70,
      lastContact: "昨天 16:30",
      supportLevel: "加强关注",
      emergencyContact: "李爸爸",
    },
    {
      id: "AL-2024-003",
      studentName: "张雨",
      university: "University of Melbourne",
      country: "澳大利亚",
      program: "本科交换 · 商学院",
      duration: "2026-02 至 2026-07",
      currentSemester: "第一学期",
      accommodation: "寄宿家庭",
      status: "适应良好",
      adaptationLevel: 92,
      lastContact: "3天前",
      supportLevel: "定期联系",
      emergencyContact: "张妈妈",
    },
    {
      id: "AL-2024-004",
      studentName: "陈小雪",
      university: "ETH Zurich",
      country: "瑞士",
      program: "硕士 · 机械工程",
      duration: "2025-09 至 2027-06",
      currentSemester: "第二学期",
      accommodation: "学生公寓",
      status: "需要帮助",
      adaptationLevel: 60,
      lastContact: "1小时前",
      supportLevel: "紧急关注",
      emergencyContact: "陈爸爸",
    },
  ];

  const statuses = ["全部", "学习顺利", "适应良好", "压力较大", "需要帮助"];

  const filteredStudents = abroadStudents.filter(
    (student) =>
      (filterStatus === "全部" || student.status === filterStatus) &&
      (searchTerm === "" ||
       student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "学习顺利": return "bg-green-100 text-green-700";
      case "适应良好": return "bg-blue-100 text-blue-700";
      case "压力较大": return "bg-orange-100 text-orange-700";
      case "需要帮助": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case "紧急关注": return "bg-red-100 text-red-700";
      case "加强关注": return "bg-orange-100 text-orange-700";
      case "常规关怀": return "bg-blue-100 text-blue-700";
      case "定期联系": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getAdaptationColor = (level: number) => {
    if (level >= 90) return "text-green-600";
    if (level >= 80) return "text-blue-600";
    if (level >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Abroad Life Support</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            海外期间生活支持
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/abroad-life/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建支持档案
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["在读学生", filteredStudents.length, "海外学习中"],
            ["适应良好", filteredStudents.filter(s => s.adaptationLevel >= 80).length, "适应度≥80%"],
            ["需要关注", filteredStudents.filter(s => s.supportLevel === "加强关注" || s.supportLevel === "紧急关注").length, "需要特殊关怀"],
            ["近期联系", filteredStudents.filter(s => s.lastContact.includes("今天") || s.lastContact.includes("昨天")).length, "最近有联系"],
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
                placeholder="搜索学生姓名、学校或国家..."
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
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/abroad-life/detail/${student.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{student.studentName}</div>
                    <ShowcaseTag>{student.country}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{student.currentSemester}</ShowcaseTag>
                  </div>
                  <div className="mb-3 text-[16px] font-semibold text-[#243246] dark:text-white">{student.university}</div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{student.program}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">学期:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{student.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">住宿:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{student.accommodation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">联系:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{student.lastContact}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">紧急联系人:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{student.emergencyContact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex flex-col items-end gap-2">
                    <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(student.status)}`}>
                      {student.status}
                    </div>
                    <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getSupportLevelColor(student.supportLevel)}`}>
                      {student.supportLevel}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[24px] font-black ${getAdaptationColor(student.adaptationLevel)}`}>{student.adaptationLevel}%</div>
                    <div className="text-[13px] text-[#94a3b8]">适应度</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">🌍</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的学生档案</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AbroadLifeListPage;
