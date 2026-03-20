# 助研 - 论文写作接口

## 1. 功能目标

围绕“提纲规划 + 章节推进 + 引文组织 + 里程碑管理 + 投稿前终检”设计接口，支撑写作模块把检索、精读成果持续回填到草稿。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载写作 landing 页 | landing 页加载 | GET | `/api/v1/research/paper-writing/page-data` |
| 新建草稿 | 顶部主按钮 | POST | `/api/v1/research/paper-writing/drafts` |
| 打开草稿详情 | 记录卡主按钮 | GET | `/api/v1/research/paper-writing/drafts/{draft_id}` |
| 新建章节 | 章节树按钮 | POST | `/api/v1/research/paper-writing/sections` |
| 更新章节内容 | 编辑器保存 | PATCH | `/api/v1/research/paper-writing/sections/{section_id}` |
| 插入引文 | 资源侧栏按钮 | POST | `/api/v1/research/paper-writing/citations` |
| 新建里程碑 | 进度面板按钮 | POST | `/api/v1/research/paper-writing/milestones` |
| 运行投稿前检查 | 终检按钮 | POST | `/api/v1/research/paper-writing/drafts/{draft_id}:preflight-check` |
| 导出版本 | 顶部导出按钮 | POST | `/api/v1/research/paper-writing/drafts/{draft_id}:export` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/research/paper-writing/drafts/{draft_id}/chat` |

## 3. 核心资源模型

- `drafts`: 写作主稿，包含标题、摘要、目标会议、当前状态
- `sections`: 章节与段落骨架
- `citations`: 引文与证据卡引用关系
- `milestones`: 写作里程碑，如“摘要定稿”“匿名化完成”

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/research/paper-writing/page-data` | 首屏聚合：进行中草稿、里程碑、快捷动作 |
| GET | `/api/v1/research/paper-writing/drafts` | 草稿列表 |
| POST | `/api/v1/research/paper-writing/drafts` | 创建草稿 |
| GET | `/api/v1/research/paper-writing/drafts/{draft_id}` | 草稿详情 |
| PATCH | `/api/v1/research/paper-writing/drafts/{draft_id}` | 更新标题、摘要、目标 venue |
| DELETE | `/api/v1/research/paper-writing/drafts/{draft_id}` | 删除草稿 |
| GET | `/api/v1/research/paper-writing/sections` | 章节列表 |
| POST | `/api/v1/research/paper-writing/sections` | 创建章节 |
| PATCH | `/api/v1/research/paper-writing/sections/{section_id}` | 更新章节 |
| POST | `/api/v1/research/paper-writing/citations` | 插入引文 |
| DELETE | `/api/v1/research/paper-writing/citations/{citation_id}` | 删除引文 |
| POST | `/api/v1/research/paper-writing/milestones` | 创建里程碑 |
| PATCH | `/api/v1/research/paper-writing/milestones/{milestone_id}` | 更新里程碑 |
| POST | `/api/v1/research/paper-writing/drafts/{draft_id}:preflight-check` | 运行终检 |
| POST | `/api/v1/research/paper-writing/drafts/{draft_id}:export` | 导出版本 |
| GET | `/api/v1/research/paper-writing/drafts/{draft_id}/messages` | 对话历史 |
| POST | `/api/v1/research/paper-writing/drafts/{draft_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "Agentic Workflow Support for University Research",
  "target_venue": "CHI 2026",
  "abstract_goal": "整理系统设计、用户研究与评测结果",
  "tags": ["hci", "llm", "workflow"]
}
```

```json
{
  "id": "draft_001",
  "title": "Agentic Workflow Support for University Research",
  "status": "outlining",
  "section_count": 0,
  "milestone_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/research/paper-writing/drafts/{draft_id}/chat`
- `context` 建议包含：`section_id`、`citation_ids`、`target_venue`
- 场景：生成摘要候选、压缩 Related Work、润色图表说明、终检匿名化问题

## 7. 状态枚举与筛选条件

- `drafts.status`: `outlining` | `writing` | `revising` | `ready_to_submit` | `submitted` | `archived`
- `sections.status`: `todo` | `drafting` | `reviewing` | `done`
- `milestones.status`: `todo` | `doing` | `done` | `missed`
- 筛选：
  - `keyword`
  - `status`
  - `target_venue`
  - `tag`

## 8. 错误与权限说明

- `403`：非作者或协作者不可编辑草稿
- `409`：已提交版本不可再覆盖原文，只能复制新版本
- `422`：终检时若缺摘要、引用或匿名化信息，返回业务错误
