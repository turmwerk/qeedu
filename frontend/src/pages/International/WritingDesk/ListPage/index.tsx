import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const WritingDeskListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("全部");

  const writingProjects = [
    {
      id: "WD-2024-001",
      studentName: "周雨婷",
      department: "文学院 · 英语系",
      academicLevel: "硕士二年级",
      projectType: "硕士学位论文",
      researchField: "比较文学与世界文学",
      supervisor: "Dr. Sarah Thompson",
      projectStage: "文献综述修订",
      writingProgress: 65,
      currentGrade: "B+",
      sessionFrequency: "每周1次",
      lastSession: "昨天 16:15",
      status: "进展顺利",
      urgentDeadlines: 1,
    },
    {
      id: "WD-2024-002",
      studentName: "李明华",
      department: "商学院 · MBA",
      academicLevel: "MBA二年级",
      projectType: "MBA毕业论文",
      researchField: "国际商务与跨文化管理",
      supervisor: "Prof. Michael Brown",
      projectStage: "数据分析",
      writingProgress: 45,
      currentGrade: "B",
      sessionFrequency: "每两周1次",
      lastSession: "3天前",
      status: "需要加强",
      urgentDeadlines: 2,
    },
    {
      id: "WD-2024-003",
      studentName: "张小慧",
      department: "理学院 · 物理系",
      academicLevel: "博士三年级",
      projectType: "博士学位论文",
      researchField: "量子物理与材料科学",
      supervisor: "Dr. James Wilson",
      projectStage: "论文写作",
      writingProgress: 85,
      currentGrade: "A-",
      sessionFrequency: "每周2次",
      lastSession: "今天 11:30",
      status: "接近完成",
      urgentDeadlines: 0,
    },
    {
      id: "WD-2024-004",
      studentName: "王思远",
      department: "社会学院 · 国际关系",
      academicLevel: "本科四年级",
      projectType: "本科毕业论文",
      researchField: "国际政治与外交学",
      supervisor: "Prof. Emily Chen",
      projectStage: "文献调研",
      writingProgress: 25,
      currentGrade: "C+",
      sessionFrequency: "每周1次",
      lastSession: "1周前",
      status: "起步阶段",
      urgentDeadlines: 3,
    },
  ];

  const projectTypes = ["全部", "本科毕业论文", "硕士学位论文", "博士学位论文", "MBA毕业论文", "期刊论文"];

  const filteredProjects = writingProjects.filter(
    (project) =>
      (filterProject === "全部" || project.projectType === filterProject) &&
      (searchTerm === "" ||
       project.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.researchField.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "接近完成": return "bg-green-100 text-green-700";
      case "进展顺利": return "bg-blue-100 text-blue-700";
      case "需要加强": return "bg-orange-100 text-orange-700";
      case "起步阶段": return "bg-purple-100 text-purple-700";
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
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Academic Writing Workshop</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            学术写作工坊
          </div>
        </div>
        <Button
          className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => navigate("/international/writing-desk/ListPage")}
        >
          <PlusOutlined className="mr-2" />
          新建写作项目
        </Button>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["写作项目", filteredProjects.length, "正在指导"],
            ["优秀作品", filteredProjects.filter(p => p.currentGrade.startsWith('A')).length, "A级成绩"],
            ["即将完成", filteredProjects.filter(p => p.writingProgress >= 80).length, "进度≥80%"],
            ["紧急项目", filteredProjects.reduce((sum, p) => sum + p.urgentDeadlines, 0), "待处理deadlines"],
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
                placeholder="搜索学生姓名、院系或研究领域..."
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
                onClick={() => setFilterProject(type)}
                className={`rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                  filterProject === type
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="cursor-pointer rounded-[24px] border border-[#dbe1f3] bg-white/76 p-6 transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/6"
              onClick={() => navigate(`/international/writing-desk/detail/${project.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[20px] font-black text-[#243246] dark:text-white">{project.studentName}</div>
                    <ShowcaseTag>{project.academicLevel}</ShowcaseTag>
                    <ShowcaseTag tone="blue">{project.projectStage}</ShowcaseTag>
                    <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${getGradeColor(project.currentGrade)}`}>
                      {project.currentGrade}
                    </div>
                    {project.urgentDeadlines > 0 && (
                      <ShowcaseTag tone="orange">{project.urgentDeadlines}项紧急</ShowcaseTag>
                    )}
                  </div>
                  <div className="mb-3 text-[16px] font-semibold text-[#243246] dark:text-white">{project.projectType}</div>
                  <div className="mb-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
                    {project.department} · {project.researchField}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">指导老师:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{project.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">指导频率:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{project.sessionFrequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#94a3b8]">最近指导:</span>
                      <span className="text-[14px] text-[#243246] dark:text-white">{project.lastSession}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                  <div className="text-right">
                    <div className={`text-[24px] font-black ${getProgressColor(project.writingProgress)}`}>
                      {project.writingProgress}%
                    </div>
                    <div className="text-[13px] text-[#94a3b8]">写作进度</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          project.writingProgress >= 80 ? 'bg-green-500' :
                          project.writingProgress >= 60 ? 'bg-blue-500' :
                          project.writingProgress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.writingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-[64px] opacity-20">✍️</div>
            <div className="mt-4 text-[20px] font-semibold text-[#243246] dark:text-white">未找到匹配的写作项目</div>
            <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
              尝试调整搜索条件或筛选器
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WritingDeskListPage;
