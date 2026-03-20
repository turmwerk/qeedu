# 助管 - 通知与公告生成接口

## 1. 功能目标

围绕“历史通知列表 + 结构化输入 + 多渠道输出 + 对话润色工作台”设计接口，支撑 sample 中的正式 landing 页和对话详情页。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载首页历史记录 | landing 页加载 | GET | `/api/v1/management/announcement-generator/page-data` |
| 新建通知 | 历史记录区主按钮 | POST | `/api/v1/management/announcement-generator/announcements` |
| 继续润色 | 记录卡主按钮 | GET | `/api/v1/management/announcement-generator/announcements/{announcement_id}` |
| 查看详情 | 记录卡次按钮 | GET | `/api/v1/management/announcement-generator/announcements/{announcement_id}` |
| 补充说明 | 记录卡次按钮 | PATCH | `/api/v1/management/announcement-generator/announcements/{announcement_id}` |
| 复制模板 | 记录卡次按钮 | POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}:duplicate` |
| 生成正式通知 | 对话页快捷动作 | POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/publish-preview` |
| 生成 FAQ | 对话页快捷动作 | POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/publish-preview` |
| 生成公众号短版 | 对话页快捷动作 | POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/publish-preview` |
| 配置发布渠道 | 渠道设置侧栏 | PUT | `/api/v1/management/announcement-generator/announcements/{announcement_id}/channels` |
| 继续对话润色 | `ChatDialog` 发送 | POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/chat` |

## 3. 核心资源模型

- `announcements`: 通知主稿，包含标题、对象、渠道、截止时间、正文
- `publish_preview`: 多渠道预览稿，包含 `formal`、`faq`、`wechat_short`、`sms_short`
- `channels`: 发布渠道配置，包含渠道代码、模板、联系人

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/announcement-generator/page-data` | 首页历史记录与快捷动作 |
| GET | `/api/v1/management/announcement-generator/announcements` | 通知列表 |
| POST | `/api/v1/management/announcement-generator/announcements` | 创建通知草稿 |
| GET | `/api/v1/management/announcement-generator/announcements/{announcement_id}` | 通知详情 |
| PATCH | `/api/v1/management/announcement-generator/announcements/{announcement_id}` | 修改正文、对象、时间 |
| DELETE | `/api/v1/management/announcement-generator/announcements/{announcement_id}` | 删除通知 |
| POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}:duplicate` | 复制为新草稿 |
| POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/publish-preview` | 生成不同渠道预览稿 |
| PUT | `/api/v1/management/announcement-generator/announcements/{announcement_id}/channels` | 更新发布渠道 |
| GET | `/api/v1/management/announcement-generator/announcements/{announcement_id}/messages` | 对话历史 |
| POST | `/api/v1/management/announcement-generator/announcements/{announcement_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "2026 春季交换项目报名通知",
  "audience": "本科生",
  "deadline_at": "2026-04-12T23:59:00+08:00",
  "channel_codes": ["email", "wechat"],
  "source_notes": "需解释 GPA、语言成绩和附件命名要求。"
}
```

```json
{
  "id": "ann_001",
  "title": "2026 春季交换项目报名通知",
  "status": "draft",
  "channel_codes": ["email", "wechat"],
  "updated_at": "2026-03-20T14:21:00+08:00"
}
```

## 6. SSE 对话流

- `POST /api/v1/management/announcement-generator/announcements/{announcement_id}/chat`
- `context` 建议包含：`preview_kind`、`channel_codes`、`policy_refs`
- 常见 quick action：
  - `formal_notice`
  - `faq`
  - `wechat_short`
  - `tone_adjust`

## 7. 状态枚举与筛选条件

- `announcements.status`: `draft` | `reviewing` | `approved` | `published` | `archived`
- `publish_preview.kind`: `formal` | `faq` | `wechat_short` | `sms_short`
- 筛选：
  - `keyword`
  - `status`
  - `channel`
  - `audience`

## 8. 错误与权限说明

- 只有创建人、所属部门管理员和超级管理员可编辑
- `409`：已发布通知不可直接覆盖，必须复制新版本
- `422`：缺少发布时间、对象或渠道时不可生成正式预览稿
