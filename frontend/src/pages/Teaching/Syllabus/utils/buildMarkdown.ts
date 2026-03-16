type SyllabusPayload = Record<string, unknown>;

const asString = (value: unknown, fallback: string) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  if (typeof value === "number") return String(value);
  return fallback;
};

export const buildSyllabusMarkdown = (payload: SyllabusPayload): string => {
  const name = asString(payload.name, "未命名课程");
  const englishName = asString(payload.englishName, "Untitled Course");
  const courseId = asString(payload.courseId, "00000000");
  const unit = asString(payload.unit, "计算机学院");
  const responsible = asString(payload.responsible, "待定");
  const credits = asString(payload.credits, "3");
  const totalHours = Number(asString(payload.totalHours, "48"));
  const theoryHours = Number(asString(payload.theoryHours, "32"));
  const practiceHours = asString(payload.practiceHours, String(totalHours - theoryHours));
  const experimentHours = asString(payload.experimentHours, "0");
  const intensiveWeeks = asString(payload.intensiveWeeks, "0");
  const weeklyHours = (totalHours / 16).toFixed(1);
  const goals = asString(payload.goals, "暂无目标");
  const teachingGoals = asString(payload.teachingGoals, "...");
  const alignmentGoals = asString(payload.alignmentGoals, "...");
  const intro = asString(payload.intro, "...");
  const textbooks = asString(payload.textbooks, "...");
  const references = asString(payload.references, "...");
  const grading = asString(payload.grading, "...");
  const publicElectiveCategory = asString(payload.publicElectiveCategory, "--");
  const generalEducationCategory = asString(payload.generalEducationCategory, "--");
  const collegeCourseCategory = asString(payload.collegeCourseCategory, "--");
  const courseLevel = asString(payload.courseLevel, "--");
  const theoryPracticeType = asString(payload.theoryPracticeType, "理论+实验课程");
  const examType = asString(payload.examType, "闭卷");
  const writerName = asString(payload.writerName, "--");
  const courseCategory = asString(payload.courseCategory, "学科基础课程");
  const courseStatus = asString(payload.courseStatus, "运行中");
  const crossSemester = asString(payload.crossSemester, "否");
  const isEnglish = asString(payload.isEnglish, "否");
  const isBilingual = asString(payload.isBilingual, "否");

  return `# ${name}

## 课程基本信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| 开课单位 | ${unit} | 通识公选类别 | ${publicElectiveCategory} |
| 通修课程类别 | ${generalEducationCategory} | 院内课程分类 | ${collegeCourseCategory} |
| 课程层次 | ${courseLevel} | 理论/实践 | ${theoryPracticeType} |
| 考试类型 | ${examType} | 课程代码 | ${courseId} |
| 课程名称 | ${name} | 英文课程名称 | ${englishName} |
| 大纲填写人姓名 | ${writerName} | 课程类别 | ${courseCategory} |
| 课程状态 | ${courseStatus} | 课程负责人姓名 | ${responsible} |
| 跨学期开课 | ${crossSemester} |  |  |

## 课程学时信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| 学分 | ${credits} | 总学时 | ${totalHours} |
| 周学时 | ${weeklyHours} | 实验学时 | ${experimentHours} |
| 实践学时 | ${practiceHours} | 理论学时 | ${theoryHours} |
| 集中实践周数 | ${intensiveWeeks} |  |  |

## 课程详细信息

<table>
  <tr>
    <td width="15%"><strong>是否全英文授课</strong></td>
    <td width="35%">${isEnglish}</td>
    <td width="15%"><strong>是否双语授课</strong></td>
    <td width="35%">${isBilingual}</td>
  </tr>
  <tr>
    <td><strong>课程育人目标</strong></td>
    <td colspan="3">${goals}</td>
  </tr>
  <tr>
    <td><strong>课程教学目标</strong></td>
    <td colspan="3">${teachingGoals}</td>
  </tr>
  <tr>
    <td><strong>与学校本科人才培养目标的契合关系</strong></td>
    <td colspan="3">${alignmentGoals}</td>
  </tr>
  <tr>
    <td><strong>课程简介</strong></td>
    <td colspan="3">${intro}</td>
  </tr>
  <tr>
    <td><strong>教材</strong></td>
    <td colspan="3">${textbooks}</td>
  </tr>
  <tr>
    <td><strong>参考资料</strong></td>
    <td colspan="3">${references}</td>
  </tr>
  <tr>
    <td><strong>成绩构成</strong></td>
    <td colspan="3">${grading}</td>
  </tr>
</table>
`;
};