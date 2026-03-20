# 助管 - 学生问答助手接口

## 1. 功能目标

围绕“问答会话流 + FAQ 知识树 + AI 建议回复 + 工单关闭”设计接口，减少重复答疑并把高频问答沉淀成可复用知识。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载问答首页 | landing 页加载 | GET | `/api/v1/management/student-qa/page-data` |
| 新建问答线程 | 顶部主按钮 | POST | `/api/v1/management/student-qa/threads` |
| 查看线程详情 | 对话列表点击 | GET | `/api/v1/management/student-qa/threads/{thread_id}` |
| 发送回复 | 对话输入框提交 | POST | `/api/v1/management/student-qa/threads/{thread_id}/replies` |
| 获取 AI 建议回复 | 右侧快捷按钮 | POST | `/api/v1/management/student-qa/threads/{thread_id}/suggested-replies` |
| 保存为 FAQ | 回复操作菜单 | POST | `/api/v1/management/student-qa/faq-items` |
| 编辑 FAQ | FAQ 详情 | PATCH | `/api/v1/management/student-qa/faq-items/{faq_id}` |
| 标记已解决 | 线程状态按钮 | POST | `/api/v1/management/student-qa/threads/{thread_id}:resolve` |
| 继续对话 | `ChatDialog` 发送 | POST | `/api/v1/management/student-qa/threads/{thread_id}/chat` |

## 3. 核心资源模型

- `threads`: 问答线程，包含提问人、场景、状态、最近消息
- `faq_items`: FAQ 条目，包含分类、标准答案、来源线程
- `suggested_replies`: AI 生成的候选回复，包含语气、长度、适用条件

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/student-qa/page-data` | 首屏聚合：热点问题、待回复线程、FAQ 分类 |
| GET | `/api/v1/management/student-qa/threads` | 线程列表 |
| POST | `/api/v1/management/student-qa/threads` | 创建线程 |
| GET | `/api/v1/management/student-qa/threads/{thread_id}` | 线程详情 |
| PATCH | `/api/v1/management/student-qa/threads/{thread_id}` | 更新标签、负责人 |
| POST | `/api/v1/management/student-qa/threads/{thread_id}/replies` | 发送人工回复 |
| POST | `/api/v1/management/student-qa/threads/{thread_id}/suggested-replies` | 生成 AI 建议回复 |
| POST | `/api/v1/management/student-qa/threads/{thread_id}:resolve` | 标记已解决 |
| GET | `/api/v1/management/student-qa/faq-items` | FAQ 列表 |
| POST | `/api/v1/management/student-qa/faq-items` | 新建 FAQ |
| PATCH | `/api/v1/management/student-qa/faq-items/{faq_id}` | 更新 FAQ |
| GET | `/api/v1/management/student-qa/threads/{thread_id}/messages` | 对话历史 |
| POST | `/api/v1/management/student-qa/threads/{thread_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "成绩单是否需要英文版",
  "student_name": "王同学",
  "category": "exchange_materials",
  "content": "交换项目申请里成绩单是自己翻译还是学校统一出具？"
}
```

```json
{
  "id": "thread_001",
  "title": "成绩单是否需要英文版",
  "status": "open",
  "category": "exchange_materials",
  "last_message_at": "2026-03-20T10:08:00+08:00"
}
```

## 6. SSE 对话流

- `POST /api/v1/management/student-qa/threads/{thread_id}/chat`
- `context` 建议包含：`faq_ids`、`policy_refs`、`tone`
- 场景：生成建议回复、压缩长答案、改成更口语化或更正式版本

## 7. 状态枚举与筛选条件

- `threads.status`: `open` | `pending_reply` | `resolved` | `archived`
- `faq_items.status`: `draft` | `active` | `deprecated`
- 筛选：
  - `keyword`
  - `category`
  - `status`
  - `owner_id`

## 8. 错误与权限说明

- `403`：非答疑负责老师不可关闭他人线程
- `409`：已归档线程不可继续发送回复
- `422`：将线程保存为 FAQ 时必须提供 FAQ 分类
