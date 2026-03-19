import React from "react";
import ResultWorkbench from "@/feature/ScenarioShowcase/ResultWorkbench";

const ExchangeHub: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        交换与访学项目中心
      </div>
      <ResultWorkbench
        title="搜索结果"
        description="点击某个项目后弹出 detail 卡片，结果栏保持简洁。"
        searchPlaceholder="搜索国家、学校或项目，例如：Canada / UBC / Summer School / HCI"
        filters={[
          { title: "项目类型", values: ["全部", "交换", "暑校", "短期访学", "联合培养"] },
          { title: "国家 / 地区", values: ["北美", "英国", "欧洲", "日本", "新加坡"] },
          { title: "院校", values: ["Partner", "UBC", "NUS", "KU Leuven"] },
        ]}
        results={[
          {
            title: "University of British Columbia",
            meta: "Canada · Partner University",
            tags: ["2026 秋季", "计算机 / HCI", "学费互免", "托福 90+"],
            summary: "名额 6 · 截止 04/18",
            badge: "交换",
          },
          {
            title: "National University of Singapore",
            meta: "Singapore · Summer Program",
            tags: ["2026 暑期", "跨学科", "自费", "雅思 6.5+"],
            summary: "开放报名 · 截止 05/10",
            badge: "暑校",
          },
          {
            title: "KU Leuven",
            meta: "Belgium · Joint Training",
            tags: ["2026 秋季", "Research fit", "学分转换", "导师匹配"],
            summary: "联合培养意向征集进行中",
            badge: "联合培养",
          },
        ]}
        previewTitle="UBC Exchange Program"
        previewDescription="University of British Columbia · 加拿大 · Partner University。适合希望进行一学期交换、课程选择较灵活并有较成熟学分转换经验的学生。"
        previewTiles={[
          {
            badge: "申请条件",
            title: "GPA 3.3+ / 托福 90+",
            description: "需院系审批，部分专业需课程计划说明。",
          },
          {
            badge: "名额",
            title: "6 个",
            description: "近两年竞争中等，建议尽早准备。",
          },
          {
            badge: "费用情况",
            title: "学费互免",
            description: "住宿、保险和生活费自理。",
          },
          {
            badge: "学分转换",
            title: "规则较成熟",
            description: "已有多门计算机课程替代经验。",
          },
        ]}
        timeline={[
          { date: "03/22", title: "校内报名开放", detail: "填写项目申请表并提交基础信息。" },
          { date: "04/18", title: "校内申请截止", detail: "完成审批、成绩单与语言成绩上传。" },
          { date: "05/02", title: "提名与后续通知", detail: "等待合作院校提名、补充材料与后续说明。" },
        ]}
      />
    </div>
  );
};

export default ExchangeHub;
