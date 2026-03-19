import React from "react";
import ResourceGroups from "@/feature/ScenarioShowcase/ResourceGroups";
import {
  BookOutlinedIcon,
  EnvironmentOutlinedIcon,
  ExclamationCircleOutlinedIcon,
  GlobalOutlinedIcon,
  MailOutlinedIcon,
  SafetyOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

const CulturalTraining: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        跨文化培训与风险提示
      </div>

      <ResourceGroups
        title="跨文化培训与风险提示"
        description="把学术礼仪、课堂沟通、法律与安全事项做成分组资源页，方便学生出发前集中补齐。"
        groups={[
          {
            title: "学术与课堂",
            description: "帮助学生提前理解课堂规范与学术互动方式。",
            cards: [
              { title: "学术礼仪", description: "课堂发言、office hour、与导师沟通", badge: "Guide", icon: <BookOutlinedIcon /> },
              { title: "课堂参与方式", description: "讨论课、presentation、提问习惯", badge: "Classroom", icon: <TeamOutlinedIcon /> },
              { title: "邮件措辞", description: "教授、行政老师、住宿办公室常用表达", badge: "Email", icon: <MailOutlinedIcon /> },
              { title: "学术诚信规范", description: "引用、合作边界、抄袭参考与 AI 使用提醒", badge: "Integrity", icon: <BookOutlinedIcon /> },
            ],
          },
          {
            title: "当地法律与安全",
            description: "围绕在外生活中最常见的法律与风险事项提供入口。",
            cards: [
              { title: "当地法律须知", description: "签证身份、租房合同、交通规则、酒精与年龄限制", badge: "Law", icon: <SafetyOutlinedIcon /> },
              { title: "安全事项", description: "夜间出行、证件保管、财产安全、诈骗提醒", badge: "Safety", icon: <ExclamationCircleOutlinedIcon /> },
              { title: "应急联系方式", description: "报警、急救、校内安保、领馆与学校支持", badge: "Emergency", icon: <ExclamationCircleOutlinedIcon /> },
            ],
          },
          {
            title: "适应与支持",
            description: "帮助学生在出发前建立跨文化适应的基础认知。",
            cards: [
              { title: "跨文化适应", description: "沟通差异、社交边界、文化误解与应对", badge: "Culture", icon: <GlobalOutlinedIcon /> },
              { title: "生活场景 FAQ", description: "住宿、购物、就医、银行、手机卡等常见问题", badge: "FAQ", icon: <EnvironmentOutlinedIcon /> },
              { title: "校内外支持入口", description: "国际处、院系 coordinator、学生服务中心", badge: "Support", icon: <TeamOutlinedIcon /> },
            ],
          },
        ]}
      />
    </div>
  );
};

export default CulturalTraining;
