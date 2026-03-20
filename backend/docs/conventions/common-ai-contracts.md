# 通用 AI 交互契约

本文件定义所有 AI 功能页共用的数据结构。各业务文档可在此基础上增补专有字段。

## PageBootstrap

```json
{
  "headline": "通知与公告生成",
  "subtitle": "结构化输入、多渠道生成和继续对话润色",
  "metrics": [
    { "key": "draft_count", "label": "草稿数", "value": "18", "trend": "+4" }
  ],
  "quick_actions": [
    { "key": "create", "label": "新建通知", "kind": "primary", "target": "/announcements" }
  ],
  "filters": {
    "status": ["draft", "reviewing", "published"],
    "channel": ["email", "wechat"]
  },
  "records": [],
  "resource_links": []
}
```

## RecordSummary

```json
{
  "id": "ann_001",
  "title": "2026 春季交换项目报名通知",
  "subtitle": "国际处 · 3 月 12 日更新",
  "summary": "覆盖报名资格、时间节点、材料要求和咨询方式",
  "status": "published",
  "tags": ["国际交流", "需附件"],
  "updated_at": "2026-03-12T10:00:00+08:00"
}
```

## RecordDetail

```json
{
  "id": "ann_001",
  "title": "2026 春季交换项目报名通知",
  "status": "reviewing",
  "owner": { "id": "u_12", "name": "张老师" },
  "fields": {},
  "tasks": [],
  "milestones": [],
  "resource_links": [],
  "chat_session": null
}
```

## ChatSession

```json
{
  "id": "chat_001",
  "resource_type": "announcement",
  "resource_id": "ann_001",
  "title": "通知润色对话",
  "bot_name": "公告助手",
  "init_message": "我已读取当前通知草稿，可以继续润色、压缩或补 FAQ。"
}
```

## ChatMessage

```json
{
  "id": "msg_001",
  "role": "assistant",
  "content": "建议增加 GPA 口径说明。",
  "created_at": "2026-03-20T10:08:00+08:00",
  "attachments": []
}
```

## QuickAction

```json
{
  "key": "generate_faq",
  "label": "生成 FAQ",
  "kind": "secondary",
  "disabled": false,
  "confirm_text": ""
}
```

## Template

```json
{
  "id": "tpl_001",
  "title": "交换项目通知模板",
  "category": "announcement",
  "body": "各位同学：",
  "updated_at": "2026-03-10T09:30:00+08:00"
}
```

## Task

```json
{
  "id": "task_001",
  "title": "补充 GPA 说明",
  "status": "todo",
  "owner_name": "李老师",
  "due_at": "2026-03-22T18:00:00+08:00"
}
```

## Milestone

```json
{
  "id": "milestone_001",
  "title": "院内审批完成",
  "status": "done",
  "date": "2026-04-02"
}
```

## MetricCard

```json
{
  "key": "completion_rate",
  "label": "按时完成率",
  "value": "91%",
  "trend": "+5%",
  "tone": "green"
}
```

## ResourceLink

```json
{
  "id": "res_001",
  "title": "FAQ 补充说明",
  "kind": "faq",
  "summary": "解释 GPA、语言成绩和附件命名要求",
  "to": "/management/announcement-generator/dialogue/ann_001"
}
```

## 功能级 Chat 请求体

```json
{
  "messages": [
    { "role": "user", "content": "请生成 FAQ 版本" }
  ],
  "context": {
    "resource_type": "announcement",
    "resource_id": "ann_001",
    "selected_ids": ["tpl_001"],
    "quick_action_key": "generate_faq"
  },
  "language": "zh-CN"
}
```

## 功能级 Chat 响应方式

- 增量输出仍使用纯文本 SSE，不引入额外 event name
- 完整对话历史通过 `GET .../messages` 获取
- 前端 `ChatDialog` 的 `dialogId` 建议直接使用 `chat_session.id`
- 若功能页需要“继续对话”，必须先拥有一个业务资源主键，再创建或绑定 `chat_session`
