import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/components/ModuleHub";
import type { Feature } from "@/components/ModuleHub";
import Card from "@/components/Card";
import { CS_COURSES } from "./data/courses";
import type { CsCourseItem } from "./data/courses";

const renderCourse = (item: Feature) => {
  const course = item as CsCourseItem;
  return (
    <Card
      iconLayout="stacked"
      icon={course.icon}
      title={course.title}
      desc={course.desc}
      level={course.school}
      badge="text-[#1d4ed8] bg-[#dbeafe]"
      darkBadge="text-[#bfdbfe] bg-[#1e3a8a]/60"
      subLinks={[
        {
          label: course.linkLabel,
          icon: <LinkOutlined />,
          onClick: () => window.open(course.url, "_blank"),
        },
      ]}
    />
  );
};

const CsSection: React.FC = () => (
  <ModuleHub
    headline="CS 自学网站"
    subtitle="操作系统 · 网络 · 算法 · 数据库 · AI · 分布式"
    features={CS_COURSES}
    renderFeature={renderCourse}
    gridCols="grid-cols-2 lg:grid-cols-3"
  />
);

export default CsSection;
