<h1 align="center">QeEdu</h1>

<div align="center">

<div>
<a href="https://cloud.qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/CLOUD-cloud.qeedu.tech-083D31?style=flat-square&logo=cloudflare&logoColor=white&labelColor=555555" alt="QeEdu Cloud">
</a>
<a href="https://qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/%E5%AE%98%E7%BD%91-qeedu.tech-0D7D5F?style=flat-square&logo=google-chrome&logoColor=white&labelColor=555555" alt="QeEdu 官网">
</a>
<a href="https://docs.qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/DOCS-docs.qeedu.tech-B8FF5C?style=flat-square&logo=readthedocs&logoColor=white&labelColor=555555" alt="QeEdu Docs">
</a>
</div>

<div>
<a href="https://react.dev/" target="_blank">
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=555555" alt="React 19">
</a>
<a href="https://vite.dev/" target="_blank">
  <img src="https://img.shields.io/badge/VITE-7-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=555555" alt="Vite 7">
</a>
<a href="https://go.dev/" target="_blank">
  <img src="https://img.shields.io/badge/GO-1.24-00ADD8?style=flat-square&logo=go&logoColor=white&labelColor=555555" alt="Go 1.24">
</a>
<a href="https://www.docker.com/" target="_blank">
  <img src="https://img.shields.io/badge/DOCKER-compose-2496ED?style=flat-square&logo=docker&logoColor=white&labelColor=555555" alt="Docker Compose">
</a>
<a href="https://github.com/turmwerk/qeedu/blob/main/LICENSE">
  <img src="https://img.shields.io/badge/LICENSE-MIT-green?style=flat-square&logo=github&logoColor=white&labelColor=555555" alt="License">
</a>
</div>

</div>

<div align="center">

简体中文 | [繁體中文](docs/README.zh-TW.md) | [English](docs/README.en.md) | [日本語](docs/README.ja.md)

</div>

## 项目定位

启育 QeEdu 是面向高校全角色、全场景的 AI 原生智能体平台。

更准确地说，QeEdu 当前定位为高校日常事务的 AI 辅助层：围绕教师、学生、辅导员、行政人员等角色，提供材料草拟、校本知识检索、流程建议、智能体协作和模板复用能力。它不替代学校已有的 OA、教务、学工、科研或财务系统，而是优先服务低风险、高频、可验证的校园事务。

## 相关站点与仓库

| 名称 | 地址 | 说明 |
| --- | --- | --- |
| QeEdu Cloud | <https://cloud.qeedu.tech/> | 主产品在线体验 |
| QeEdu Home | <https://qeedu.tech/> | 官方网站、商业模式与版本路线 |
| QeEdu Docs | <https://docs.qeedu.tech/> | 部署、试点、数据安全与开发文档 |
| qeedu-home | <https://github.com/turmwerk/qeedu-home> | 官网仓库 |
| qeedu-docs | <https://github.com/turmwerk/qeedu-docs> | 文档站仓库 |

## 版本路线

QeEdu 按三层路线规划：

- **Community**：社区版，自部署、学习、二次开发和场景共建入口。
- **Cloud**：云服务，面向快速体验、比赛展示、轻量协作和在线试用。
- **Education**：教育版，面向私有化部署、校本知识库初始化、场景模板定制、权限审计和培训服务。

## 核心能力

- 多角色入口：教师、学生、辅导员、行政人员。
- 校本知识库：制度、模板、FAQ、历史案例、课程资料。
- 智能体与工作流：检索、生成、校对、导出、任务协作。
- AI 聊天与 Copilot：面向学习、教学、科研、管理和项目场景。
- 数据安全边界：Cloud 试用、自部署、教育版私有化分层。
- OAuth 登录：GitHub、Google、Microsoft 等登录回调配置。

## 技术栈

### 前端

- React 19
- Vite 7
- TypeScript 5
- Ant Design 6
- React Router
- Monaco Editor
- React Markdown
- Zustand

### 后端

- Go 1.24
- Gin
- gRPC / Protobuf
- GORM / MySQL
- Docker / Docker Compose
- Python AI microservices

## 仓库结构

```text
qeedu/
├── frontend/              # Cloud 产品前端
├── backend/               # 后端微服务与部署配置
│   ├── gateway/           # API 网关、认证、OAuth
│   ├── user-services/     # 用户服务
│   ├── ai-chat/           # AI 聊天服务
│   ├── ai-copilot/        # Copilot 服务
│   ├── sandbox/           # 沙箱运行服务
│   ├── proto/             # Protobuf 定义
│   └── deploy/            # Docker Compose 部署
└── docs/                  # 仓库说明与补充文档
```

## 前端开发

```bash
cd frontend
pnpm install
pnpm dev
```

生产环境前端 API 地址示例：

```text
VITE_API_BASE_URL=https://api.qeedu.tech/api/v1
```

## 后端部署

后端部署入口位于：

```bash
backend/deploy/docker-compose.yml
```

常用命令：

```bash
cd backend/deploy
docker compose up -d
```

OAuth 登录相关生产配置应保持一致：

```text
FRONTEND_URL=https://cloud.qeedu.tech
GITHUB_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/github/callback
GOOGLE_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/google/callback
MICROSOFT_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/microsoft/callback
```

## 数据安全说明

QeEdu 不建议在 Cloud 试用环境中处理高敏校务数据。涉及学生个人信息、未公开校务文件或内部审批材料时，应优先使用学校认可的模型网关或教育版私有化部署。

AI 输出应作为草稿、建议和辅助材料，正式业务结论仍需人工确认。

## 开源与贡献

当前仓库作为 QeEdu Community 的代码基础逐步整理。欢迎围绕以下方向提交 Issue 或 PR：

- 部署文档补充。
- 校园场景模板。
- 前端体验优化。
- 智能体工作流和知识库能力。
- 安全、权限、审计相关改进。

## 许可证

本仓库基于 [MIT License](LICENSE) 开源。

