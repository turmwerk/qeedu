import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import Placeholder from "@/pages/Account/Placeholder";

const Account = lazy(() => import("@/pages/Account"));
const Overview = lazy(() => import("@/pages/Account/Overview"));
const Settings = lazy(() => import("@/pages/Account/Settings"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备个人中心..." }),
      ),
    },
    createElement(Component),
  );

const placeholderElement = (title: string, subtitle: string, items: string[]) =>
  createElement(Placeholder, { title, subtitle, items });

const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: lazyElement(Account),
    children: [
      { index: true, element: lazyElement(Overview) },
      {
        path: "profile",
        element: placeholderElement("个人资料", "维护用户名、头像、展示信息和院系身份。", [
          "用户名与显示名称",
          "邮箱与联系方式",
          "头像与个人简介",
          "院系、角色和专业标签",
        ]),
      },
      {
        path: "preferences",
        element: placeholderElement("账户偏好", "设置个人中心默认视图、界面密度和常用入口。", [
          "默认进入页面",
          "卡片密度偏好",
          "常用模块快捷入口",
          "个人中心显示字段",
        ]),
      },
      {
        path: "security",
        element: placeholderElement("密码与安全", "管理密码、验证码和异常登录保护。", [
          "修改登录密码",
          "邮箱验证码保护",
          "活跃会话管理",
          "安全事件提醒",
        ]),
      },
      {
        path: "identity",
        element: placeholderElement("身份信息", "维护校内角色和业务使用身份。", [
          "学生 / 教师 / 管理员角色",
          "院系与组织归属",
          "教学或科研方向",
          "国际交流资料",
        ]),
      },
      {
        path: "sign-in",
        element: placeholderElement("登录方式", "查看邮箱、GitHub、Google 等登录绑定状态。", [
          "邮箱密码登录",
          "邮箱验证码登录",
          "GitHub OAuth",
          "Google OAuth",
        ]),
      },
      {
        path: "sessions",
        element: placeholderElement("活跃会话", "查看当前登录设备并撤销异常会话。", [
          "当前浏览器会话",
          "最近登录设备",
          "会话撤销",
          "异常地点提醒",
        ]),
      },
      {
        path: "oauth",
        element: placeholderElement("第三方绑定", "管理 GitHub、Google 等外部账号绑定。", [
          "GitHub 账号绑定",
          "Google 账号绑定",
          "绑定邮箱校验",
          "解绑风险确认",
        ]),
      },
      {
        path: "notifications",
        element: placeholderElement("通知偏好", "控制作业、流程、论文和系统消息的提醒方式。", [
          "邮件提醒",
          "站内消息",
          "AI 任务完成提醒",
          "重要安全提醒",
        ]),
      },
      {
        path: "ai-preferences",
        element: placeholderElement("AI 偏好", "设置常用模型、输出风格和上下文偏好。", [
          "默认聊天模型",
          "代码助手偏好",
          "回答语言与格式",
          "文件上下文策略",
        ]),
      },
      {
        path: "model-config",
        element: placeholderElement("模型配置", "配置默认模型、免费模型优先级和功能路由策略。", [
          "默认聊天模型",
          "代码助手模型",
          "DeepSeek 模型策略",
          "OpenRouter 免费模型优先级",
        ]),
      },
      {
        path: "context-policy",
        element: placeholderElement("上下文策略", "控制 AI 使用文件、项目和历史对话的范围。", [
          "当前文件自动附加",
          "项目文件上下文",
          "历史对话引用",
          "敏感信息过滤",
        ]),
      },
      {
        path: "privacy",
        element: placeholderElement("隐私与授权", "管理授权应用、数据使用范围和可见性。", [
          "第三方登录授权",
          "AI 上下文授权",
          "资料可见范围",
          "数据保留策略",
        ]),
      },
      {
        path: "billing",
        element: placeholderElement("额度与账单", "查看 AI 调用额度、用量统计和计费记录。", [
          "AI 调用额度",
          "本月用量",
          "模型消耗明细",
          "账单记录",
        ]),
      },
      {
        path: "data",
        element: placeholderElement("数据导出", "导出账户资料、学习记录和 AI 对话历史。", [
          "账户资料导出",
          "学习进度导出",
          "AI 对话导出",
          "删除账户数据",
        ]),
      },
      {
        path: "activity",
        element: placeholderElement("活动日志", "查看登录、设置修改和关键业务操作记录。", [
          "最近登录",
          "密码与邮箱操作",
          "AI 功能使用记录",
          "业务数据变更记录",
        ]),
      },
      {
        path: "audit",
        element: placeholderElement("审计记录", "集中查看安全、AI 和关键业务审计事件。", [
          "安全审计",
          "AI 调用审计",
          "数据导出记录",
          "权限变更记录",
        ]),
      },
      { path: "settings", element: lazyElement(Settings) },
      {
        path: "help",
        element: placeholderElement("帮助反馈", "提交问题反馈并查看支持工单状态。", [
          "功能问题反馈",
          "安全问题上报",
          "工单处理进度",
          "常见问题入口",
        ]),
      },
      { path: "*", element: createElement(Navigate, { to: "/account", replace: true }) },
    ],
  },
];

export default accountRoutes;
