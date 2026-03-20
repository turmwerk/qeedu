# 国际交流 - 多语言沟通与邮件助手接口

## 1. 功能目标

围绕“沟通记录列表 + 邮件草稿工作台 + 模板库 + 双语润色对话”设计接口，支撑导师联系、项目问询、签证说明和 FAQ 输出。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载邮件助手 landing 页 | landing 页加载 | GET | `/api/v1/international/writing-desk/page-data` |
| 新建沟通记录 | 列表页主按钮 | POST | `/api/v1/international/writing-desk/communication-records` |
| 生成邮件草稿 | 快捷动作按钮 | POST | `/api/v1/international/writing-desk/drafts` |
| 打开草稿详情 | 记录卡点击 | GET | `/api/v1/international/writing-desk/drafts/{draft_id}` |
| 保存模板 | 模板区按钮 | POST | `/api/v1/international/writing-desk/templates` |
| 改成双语版本 | 详情页按钮 | POST | `/api/v1/international/writing-desk/drafts/{draft_id}:bilingualize` |
| 发送前检查 | 顶部按钮 | POST | `/api/v1/international/writing-desk/drafts/{draft_id}:preflight` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/writing-desk/drafts/{draft_id}/chat` |

## 3. 核心资源模型

- `communication_records`: 沟通背景记录，含对象、场景、发送状态
- `drafts`: 邮件/通知草稿
- `templates`: 模板库，含语气、适用场景、语言

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/writing-desk/page-data` | 首屏聚合：最近草稿、模板、发送建议 |
| GET | `/api/v1/international/writing-desk/communication-records` | 沟通记录列表 |
| POST | `/api/v1/international/writing-desk/communication-records` | 创建沟通记录 |
| GET | `/api/v1/international/writing-desk/drafts` | 草稿列表 |
| POST | `/api/v1/international/writing-desk/drafts` | 创建草稿 |
| GET | `/api/v1/international/writing-desk/drafts/{draft_id}` | 草稿详情 |
| PATCH | `/api/v1/international/writing-desk/drafts/{draft_id}` | 更新正文、收件人、语言 |
| DELETE | `/api/v1/international/writing-desk/drafts/{draft_id}` | 删除草稿 |
| POST | `/api/v1/international/writing-desk/drafts/{draft_id}:bilingualize` | 生成双语版本 |
| POST | `/api/v1/international/writing-desk/drafts/{draft_id}:preflight` | 发送前检查 |
| GET | `/api/v1/international/writing-desk/templates` | 模板列表 |
| POST | `/api/v1/international/writing-desk/templates` | 保存模板 |
| GET | `/api/v1/international/writing-desk/drafts/{draft_id}/messages` | 对话历史 |
| POST | `/api/v1/international/writing-desk/drafts/{draft_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "scenario": "first_contact",
  "recipient_name": "Program Coordinator",
  "recipient_org": "University of Helsinki",
  "language": "en"
}
```

```json
{
  "id": "draft_001",
  "scenario": "first_contact",
  "status": "draft",
  "language": "en",
  "recipient_name": "Program Coordinator"
}
```

## 6. SSE 对话流

- `POST /api/v1/international/writing-desk/drafts/{draft_id}/chat`
- `context` 建议包含：`template_id`、`tone`、`recipient_profile`
- 场景：润色语气、压缩长度、生成 follow-up、补充 FAQ

## 7. 状态枚举与筛选条件

- `drafts.status`: `draft` | `reviewing` | `ready` | `sent` | `archived`
- `templates.language`: `zh` | `en` | `bilingual`
- 筛选：
  - `keyword`
  - `status`
  - `scenario`
  - `language`

## 8. 错误与权限说明

- `403`：非草稿所有人不可编辑
- `409`：已发送草稿不可直接覆盖正文
- `422`：收件对象或场景缺失时不可运行发送前检查
