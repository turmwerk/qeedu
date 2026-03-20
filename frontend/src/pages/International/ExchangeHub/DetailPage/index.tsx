import React from "react";
import {
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import { LinkOutlined, CalendarOutlined, TeamOutlined, DollarOutlined, BookOutlined } from "@ant-design/icons";

const ExchangeHubDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8 overflow-y-auto scroll-smooth h-screen">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Exchange Program</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            University of British Columbia
          </div>
          <div className="mt-2 text-[16px] text-[#67748a] dark:text-[#dbe5f3]">
            Canada · Partner University · 交换项目
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            加入收藏
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            立即申请
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap gap-3 mb-6">
          <ShowcaseTag>Canada</ShowcaseTag>
          <ShowcaseTag tone="green">Partner University</ShowcaseTag>
          <ShowcaseTag tone="blue">2026 秋季</ShowcaseTag>
          <ShowcaseTag tone="orange">计算机 / HCI</ShowcaseTag>
          <ShowcaseTag tone="green">学费互免</ShowcaseTag>
        </div>

        <div className="text-[18px] leading-8 text-[#475569] dark:text-[#dbe5f3]">
          University of British Columbia 是加拿大顶尖的研究型大学，位于温哥华。
          适合希望进行一学期交换、课程选择较灵活并有较成熟学分转换经验的学生。
          该项目提供优质的学术环境和丰富的研究机会。
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${showcasePanelClass} p-6`}>
          <div className="mb-6">
            <div className="text-[20px] font-black text-[#243246] dark:text-white">项目详情</div>
          </div>
          <div className="space-y-4">
            {[
              { icon: <CalendarOutlined />, label: "项目时间", value: "2026年9月 - 2026年12月（一学期）" },
              { icon: <TeamOutlined />, label: "招生名额", value: "6个名额" },
              { icon: <BookOutlined />, label: "学术要求", value: "GPA 3.3+ / 托福 90+ / 雅思 6.5+" },
              { icon: <DollarOutlined />, label: "费用情况", value: "学费互免，住宿和生活费自理" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 text-[#5672ff]">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[#243246] dark:text-white">{item.label}</div>
                  <div className="mt-1 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${showcasePanelClass} p-6`}>
          <div className="mb-6">
            <div className="text-[20px] font-black text-[#243246] dark:text-white">申请要求</div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-[#243246] dark:text-white mb-2">学术要求</div>
              <ul className="text-[15px] text-[#67748a] dark:text-[#dbe5f3] space-y-1">
                <li>• GPA 3.3以上</li>
                <li>• 需院系推荐和审批</li>
                <li>• 部分专业需课程计划说明</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#243246] dark:text-white mb-2">语言要求</div>
              <ul className="text-[15px] text-[#67748a] dark:text-[#dbe5f3] space-y-1">
                <li>• 托福总分90+，各单项不低于20</li>
                <li>• 或雅思总分6.5+，各单项不低于6.0</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#243246] dark:text-white mb-2">其他材料</div>
              <ul className="text-[15px] text-[#67748a] dark:text-[#dbe5f3] space-y-1">
                <li>• 个人陈述</li>
                <li>• 成绩单（中英文）</li>
                <li>• 推荐信1-2封</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">申请时间线</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">重要时间节点和申请流程</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              date: "03/22",
              title: "校内报名开放",
              detail: "填写项目申请表并提交基础信息。",
              status: "进行中"
            },
            {
              date: "04/18",
              title: "校内申请截止",
              detail: "完成审批、成绩单与语言成绩上传。",
              status: "截止"
            },
            {
              date: "05/02",
              title: "提名与后续通知",
              detail: "等待合作院校提名、补充材料与后续说明。",
              status: "待定"
            },
          ].map((timeline) => (
            <div key={timeline.date} className="rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="text-[24px] font-black text-[#5672ff]">{timeline.date}</div>
              <div className="mt-3 text-[18px] font-black text-[#243246] dark:text-white">{timeline.title}</div>
              <div className="mt-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{timeline.detail}</div>
              <div className="mt-3">
                <span className={`inline-block rounded-[8px] px-2 py-1 text-[12px] font-semibold ${
                  timeline.status === "进行中" ? "bg-blue-100 text-blue-700" :
                  timeline.status === "截止" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {timeline.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">项目亮点</div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              badge: "学术环境",
              title: "世界顶尖研究型大学",
              description: "QS世界排名前40，计算机科学专业享誉全球，研究资源丰富。",
            },
            {
              badge: "课程灵活性",
              title: "课程选择多样化",
              description: "可选修本科生和研究生课程，学分转换机制成熟完善。",
            },
            {
              badge: "地理位置",
              title: "温哥华 - 宜居城市",
              description: "气候温和，多元文化，华人社区活跃，生活便利。",
            },
            {
              badge: "费用优势",
              title: "学费互免政策",
              description: "节省大量学费开支，住宿和生活成本相对合理。",
            },
          ].map((highlight) => (
            <div key={highlight.title} className="rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="mb-3">
                <span className="inline-block rounded-[8px] bg-[var(--brand-blue)] px-2 py-1 text-[12px] font-semibold text-white">
                  {highlight.badge}
                </span>
              </div>
              <div className="text-[18px] font-black text-[#243246] dark:text-white">{highlight.title}</div>
              <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{highlight.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">相关链接</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { title: "官方项目页面", url: "https://www.ubc.ca/", desc: "查看详细项目信息和要求" },
            { title: "学分转换指南", url: "#", desc: "了解学分认定和转换流程" },
            { title: "住宿申请指南", url: "#", desc: "校内外住宿选择和申请" },
            { title: "签证申请指南", url: "#", desc: "加拿大学生签证申请流程" },
          ].map((link) => (
            <div key={link.title} className="flex items-center gap-4 rounded-[16px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
              <LinkOutlined className="text-[#5672ff]" />
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{link.title}</div>
                <div className="mt-1 text-[13px] text-[#67748a] dark:text-[#dbe5f3]">{link.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExchangeHubDetailPage;
