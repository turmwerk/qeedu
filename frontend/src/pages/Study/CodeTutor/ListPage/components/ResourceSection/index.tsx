import React from "react";
import { LinkOutlined } from "@ant-design/icons";

const ResourceSection: React.FC = () => {
  return (
    <section className="rounded-xl p-[18px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
      <div className="mb-4 flex items-center gap-2">
        <LinkOutlined className="text-lg text-[var(--primary)]" />
        <h2 className="m-0 text-base font-semibold text-[var(--text-primary)]">学习资源</h2>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">精选文档、书籍与视频资源即将整合，敬请期待。</p>
    </section>
  );
};

export default ResourceSection;
