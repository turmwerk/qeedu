import React from "react";
import { footerLinkGroups } from "../data/links";

const LinksPanel: React.FC = () => {
  return (
    <section className="w-full px-6 py-12 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/20">
      <div className="mx-auto max-w-7xl">

        {/* 连通的框架布局 - 透明背景融入 */}
        <div className="rounded-2xl border border-gray-200/40 bg-transparent backdrop-blur-[8px] overflow-hidden dark:border-gray-700/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {footerLinkGroups.map((group, groupIdx) => (
              <div
                key={group.title}
                className={`p-6 border-gray-200/40 dark:border-gray-700/40 ${
                  // 添加右边框（除了最后一列）
                  groupIdx < footerLinkGroups.length - 1 ? 'lg:border-r' : ''
                } ${
                  // 在小屏幕下添加底边框（除了最后一行）
                  groupIdx < footerLinkGroups.length - 1 ? 'sm:border-b lg:border-b-0' : ''
                } ${
                  // 在中等屏幕下，奇数列添加右边框
                  groupIdx % 2 === 0 && groupIdx < footerLinkGroups.length - 1 ? 'sm:border-r' : ''
                }`}
              >
                <div className="text-[18px] font-bold text-[#243246] dark:text-white mb-1">
                  {group.title}
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mb-5"></div>
                <div className="space-y-4">
                  {group.links.map((link, idx) => (
                    <a
                      key={`${group.title}-${link.label}-${idx}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex w-fit items-center gap-3 text-[15px] font-medium text-[var(--brand-blue)] hover:text-[var(--brand-purple)] transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                    >
                      <span className="text-[16px] flex-shrink-0" style={{ fontSize: '16px' }}>
                        <link.Icon />
                      </span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinksPanel;
