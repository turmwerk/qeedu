import React, { useCallback, useEffect, useState } from "react";
import ListPage from "./ListPage";
import DetailPage from "./DetailPage";
import Dialog from "@/components/Dialog";

type PageShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
};

const PageShell: React.FC<PageShellProps> = ({ children, contentClassName }) => {
  const contentClass = contentClassName ?? "pt-3 pb-6 px-6";
  return (
    <div
      className="relative h-[calc(100vh-80px)] min-h-0 flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden"
      data-oid="m2e-jxo"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        data-oid="ubda76f"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-blue-300/30 blur-[120px] -top-48 -left-48 animate-[float_20s_ease-in-out_infinite]"
          data-oid="n2:nuro"
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-[100px] top-1/4 -right-32 animate-[float_25s_ease-in-out_infinite_reverse]"
          data-oid="lc:5m-n"
        />

        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/25 to-indigo-300/25 blur-[90px] bottom-0 left-1/3 animate-[float_22s_ease-in-out_infinite]"
          data-oid="gbzf5bv"
        />
      </div>
      <style data-oid="-8cd:8b">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
      <div className={`relative z-10 flex-1 min-h-0 ${contentClass}`} data-oid="zobt:l.">
        {children}
      </div>
    </div>
  );
};

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const STORAGE_KEY = "syllabus_outlines";

const Syllabus: React.FC = () => {
  const exampleMd = `# 课程大纲

## 课程基本信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| **开课单位** | 智能科学与技术学院 | **通识公选类别** | -- |
| **通修课程类别** | -- | **院内课程分类** | -- |
| **课程层次** | -- | **理论/实践** | 理论+实验课程 |
| **考试类型** | 闭卷 | **课程号** | 90111205 |
| **课程名** | 机器学习导论 | **英文课程名** | Introduction to machine learning |
| **大纲填写人姓名** | -- | **课程类别** | 学科基础课程 |
| **课程状态** | 运行中 | **课程负责人姓名** | 李文斌 |
| **跨学期课程** | 否 | | |

## 课程学时信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| **学分** | 3 | **总学时** | 48 |
| **周学时** | 3.0 | **实验学时** | 0 |
| **实践学时** | 16 | **理论学时** | 32 |
| **集中实践周数** | 0 | | |

## 课程详细信息

<table>
  <tr>
    <td width="15%"><strong>是否全英文授课</strong></td>
    <td width="35%">否</td>
    <td width="15%"><strong>是否双语授课</strong></td>
    <td width="35%">否</td>
  </tr>
  <tr>
    <td><strong>课程育人目标</strong></td>
    <td colspan="3">1. 进行理想信念教育，培养学生的爱国情怀，激励学生在机器学习基础领域勇于探索、勇于争先，在学术和科研上为国争光；
2. 进行社会责任感教育，结合社会民生的重大需求，激发学生的社会责任感，将机器学习技术用到民生需求上；
3. 进行自我追求教育，引导和培养学生坚韧性格、追求真理、勇攀高峰的精神，辩证看待和研究科学问题。</td>
  </tr>
  <tr>
    <td><strong>课程教学目标</strong></td>
    <td colspan="3">本课程面向大三学生进行授课，该课程的讲授与考核侧重基础理论和工程实践的结合。讲授基础知识：通过讲授机器学习的基础理论与技术知识，让学生系统地、前瞻性地了解“机器学习”的发展状况，掌握相关理论知识，全面了解“机器学习”的发展概况。为有志于在该领域相关的前沿学科进行探索研究与工程开发的学生提供良好的基础知识储备。传授研究方法：针对机器学习领域不同方向的研究特点，来传授发现问题、分析问题和解决问题的研究方法；课程讲授过程中会重视与学生的探讨与交互，旨在培养学生的主动探索性思维与基本科研技能，激发学生对该领域的学习兴趣与研究兴趣。此外，通过指导学生查找并阅读相关技术的学术论文，来启发学生形成正确的研究思维方式，培养良好的思考和研究习惯。积累实战经验：针对机器学习领域一些可供实践的课题，如：图像分类、目标检测，布置适当的课程作业，通过设置研究课题、算法设计、应用验证，为学生提供具有研究性和工程性结合的初步科研实践经验。</td>
  </tr>
  <tr>
    <td><strong>与学校本科人才培养目标的契合关系</strong></td>
    <td colspan="3">培养学生卓越的专业素养,培育学生强烈的家国情怀与社会责任感,培养学生探究精神与创新创造能力,提升学生全球素养</td>
  </tr>
  <tr>
    <td><strong>课程简介</strong></td>
    <td colspan="3">1. 课程概述：简述机器学习的概念、发展过程和简单分类，并简述每一种常用机器学习算法的原理和用途。
2. 决策树：详细阐述决策树的概念、决策树的使用过程和训练过程。
3. 神经网络：介绍神经网络的概念、原理和训练过程，简单介绍神经网络相关的研究，包括深度学习、卷积神经网络、递归神经网络等。
4. 贝叶斯学习：介绍贝叶斯学习的原理和朴素贝叶斯的训练过程。
5. 概率与学习：介绍最大似然估计和期望最大化的基本原理和对应的应用。
6. 最近邻居算法：介绍KNN原理和应用。
7. 无监督学习：介绍层次聚类、原型聚类和密度聚类等聚类算法的对应算法，如k-means、高斯混合聚类等。
8. 集成学习：介绍集成学习原理，以及代表性算法：Bagging和随机森林、Boosting和AdaBoost。
9. 支持向量机：介绍支持向量机的基本原理，理论证明，并介绍非线性支持向量机和多类支持向量机。
10. 演化学习：介绍遗传算法、模式理论的基本原理和应用。
11. 小样本学习、持续学习、自监督学习：介绍前言热点研究方向，开拓视野。</td>
  </tr>
  <tr>
    <td><strong>教材</strong></td>
    <td colspan="3">1、《机器学习》 周志华 清华大学出版社 2016.01 使用非马工程教材</td>
  </tr>
  <tr>
    <td><strong>参考资料</strong></td>
    <td colspan="3">《机器学习》，周志华著，清华大学出版社
《统计机器学习方法》，李航著，清华大学出版社
《Machine Learning: An Algorithmic Perspective》，Stephen Marsland (著)</td>
  </tr>
  <tr>
    <td><strong>成绩构成</strong></td>
    <td colspan="3">1. 平时成绩 (20%) ：小作业完成情况
2. 期中成绩 (30%) ：课程大作业成绩
3. 期末成绩 (50%) ：期末考试成绩</td>
  </tr>
</table>
`;
  const [md, setMd] = useState(exampleMd);
  const [openFull, setOpenFull] = useState(false);
  const [view, setView] = useState<"list" | "edit">("list");
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOutlines(JSON.parse(raw));
    } catch (e) {
      console.error("load outlines", e);
    }
  }, []);

  const persist = (next: Outline[]) => {
    setOutlines(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("syllabus-outlines-updated"));
    } catch (e) {
      console.error("save outlines", e);
    }
  };

  const handleCreate = (payload: Record<string, any>) => {
    const id = Date.now().toString();
    const name = payload.name || "未命名课程";
    const englishName = payload.englishName || "Untitled Course";
    const courseId = payload.courseId || "00000000";
    const unit = payload.unit || "计算机学院";
    const responsible = payload.responsible || "待定";

    // Default values if not provided
    const credits = payload.credits || 3;
    const totalHours = payload.totalHours || 48;
    const theoryHours = payload.theoryHours || 32;
    const practiceHours = payload.practiceHours || totalHours - theoryHours;
    const experimentHours = payload.experimentHours || 0;
    const intensiveWeeks = payload.intensiveWeeks || 0;
    const weeklyHours = (totalHours / 16).toFixed(1);

    const goals = payload.goals || "暂无目标";
    const teachingGoals = payload.teachingGoals || "...";
    const alignmentGoals = payload.alignmentGoals || "...";
    const intro = payload.intro || "...";
    const textbooks = payload.textbooks || "...";
    const references = payload.references || "...";
    const grading = payload.grading || "...";

    const publicElectiveCategory = payload.publicElectiveCategory || "--";
    const generalEducationCategory = payload.generalEducationCategory || "--";
    const collegeCourseCategory = payload.collegeCourseCategory || "--";
    const courseLevel = payload.courseLevel || "--";
    const theoryPracticeType = payload.theoryPracticeType || "理论+实验课程";
    const examType = payload.examType || "闭卷";
    const writerName = payload.writerName || "--";
    const courseCategory = payload.courseCategory || "学科基础课程";
    const courseStatus = payload.courseStatus || "运行中";
    const crossSemester = payload.crossSemester || "否";
    const isEnglish = payload.isEnglish || "否";
    const isBilingual = payload.isBilingual || "否";

    const mdText = `# ${name}

## 课程基本信息

<table>
  <tr>
    <td width="15%">开课单位</td>
    <td width="35%">${unit}</td>
    <td width="15%">通识公选类别</td>
    <td width="35%">${publicElectiveCategory}</td>
  </tr>
  <tr>
    <td>通修课程类别</td>
    <td>${generalEducationCategory}</td>
    <td>院内课程分类</td>
    <td>${collegeCourseCategory}</td>
  </tr>
  <tr>
    <td>课程层次</td>
    <td>${courseLevel}</td>
    <td>理论/实践</td>
    <td>${theoryPracticeType}</td>
  </tr>
  <tr>
    <td>考试类型</td>
    <td>${examType}</td>
    <td>课程号</td>
    <td>${courseId}</td>
  </tr>
  <tr>
    <td>课程名</td>
    <td>${name}</td>
    <td>英文课程名</td>
    <td>${englishName}</td>
  </tr>
  <tr>
    <td>大纲填写人姓名</td>
    <td>${writerName}</td>
    <td>课程类别</td>
    <td>${courseCategory}</td>
  </tr>
  <tr>
    <td>课程状态</td>
    <td>${courseStatus}</td>
    <td>课程负责人姓名</td>
    <td>${responsible}</td>
  </tr>
  <tr>
    <td>跨学期课程</td>
    <td colspan="3">${crossSemester}</td>
  </tr>
</table>

## 课程学时信息

<table>
  <tr>
    <td width="15%">学分</td>
    <td width="35%">${credits}</td>
    <td width="15%">总学时</td>
    <td width="35%">${totalHours}</td>
  </tr>
  <tr>
    <td>周学时</td>
    <td>${weeklyHours}</td>
    <td>实验学时</td>
    <td>${experimentHours}</td>
  </tr>
  <tr>
    <td>实践学时</td>
    <td>${practiceHours}</td>
    <td>理论学时</td>
    <td>${theoryHours}</td>
  </tr>
  <tr>
    <td>集中实践周数</td>
    <td colspan="3">${intensiveWeeks}</td>
  </tr>
</table>

## 课程详细信息

<table>
  <tr>
    <td width="15%">是否全英文授课</td>
    <td width="35%">${isEnglish}</td>
    <td width="15%">是否双语授课</td>
    <td width="35%">${isBilingual}</td>
  </tr>
  <tr>
    <td>课程育人目标</td>
    <td colspan="3">${goals}</td>
  </tr>
  <tr>
    <td>课程教学目标</td>
    <td colspan="3">${teachingGoals}</td>
  </tr>
  <tr>
    <td>与学校本科人才培养目标的契合关系</td>
    <td colspan="3">${alignmentGoals}</td>
  </tr>
  <tr>
    <td>课程简介</td>
    <td colspan="3">${intro}</td>
  </tr>
  <tr>
    <td>教材</td>
    <td colspan="3">${textbooks}</td>
  </tr>
  <tr>
    <td>参考资料</td>
    <td colspan="3">${references}</td>
  </tr>
  <tr>
    <td>成绩构成</td>
    <td colspan="3">${grading}</td>
  </tr>
  <tr>
    <td>备注</td>
    <td colspan="3">${payload.notes || ""}</td>
  </tr>
</table>
`;

    const item: Outline = {
      id,
      title: name,
      subtitle: unit,
      md: mdText,
      createdAt: Date.now(),
    };
    const next = [item, ...outlines];
    persist(next);
    setMd(mdText);
    setCurrentId(id);
    setView("edit");
  };

  const handleDelete = (id: string) => {
    const next = outlines.filter((o) => o.id !== id);
    persist(next);
    // 清理对应大纲的Dialog对话数据
    Dialog.clearDialog(id);
    if (view === "edit") setView("list");
    if (currentId === id) setCurrentId(null);
  };

  const handleEdit = useCallback(
    (id: string) => {
    const found = outlines.find((o) => o.id === id);
    if (found) {
      setMd(found.md);
      setCurrentId(id);
      setView("edit");
    }
    },
    [outlines]
  );

  useEffect(() => {
    if (!currentId) return;
    window.dispatchEvent(
      new CustomEvent("syllabus-current-id", { detail: { id: currentId } })
    );
  }, [currentId]);

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleEdit(detail.id);
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) {
        handleDelete(detail.id);
      }
    };
    window.addEventListener("syllabus-outline-select", onSelect as EventListener);
    window.addEventListener("syllabus-outline-delete", onDelete as EventListener);
    return () => {
      window.removeEventListener("syllabus-outline-select", onSelect as EventListener);
      window.removeEventListener("syllabus-outline-delete", onDelete as EventListener);
    };
  }, [handleEdit]);

  const handleRename = (id: string, newName?: string) => {
    if (!newName) return;
    const found = outlines.find((o) => o.id === id);
    if (!found) return;
    if (newName && newName !== found.title) {
      const next = outlines.map((o) =>
        o.id === id ? { ...o, title: newName } : o,
      );
      persist(next);
    }
  };

  if (view === "edit") {
    const currentOutline = outlines.find((o) => o.id === currentId);
    return (
      <PageShell contentClassName="p-0" data-oid="7ut1p8i">
        <DetailPage
          md={md}
          setMd={(updated: string) => {
            setMd(updated);
            if (currentId) {
              const next = outlines.map((o) =>
                o.id === currentId ? { ...o, md: updated } : o,
              );
              persist(next);
            }
          }}
          onBack={() => {
            setOpenFull(false);
            setView("list");
          }}
          openFull={openFull}
          setOpenFull={setOpenFull}
          title={currentOutline?.title}
          id={currentOutline?.id}
          onRename={(id, newName) => handleRename(id, newName)}
          data-oid="ov3eqbg"
        />
      </PageShell>
    );
  }
  return (
    <PageShell data-oid="2-:yi8t">
      <ListPage
        items={outlines}
        onEdit={(id?: string) => {
          if (id) handleEdit(id);
          else setView("edit");
        }}
        onCreate={handleCreate}
        onDelete={(id?: string) => id && handleDelete(id)}
        onRename={(id?: string, newName?: string) =>
          id && handleRename(id, newName)
        }
        data-oid="zf4txpt"
      />
    </PageShell>
  );
};

export default Syllabus;
