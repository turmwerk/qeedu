# 国际交流 - 在外生活支持接口

## 1. 功能目标

围绕“支持工单 + 生活指南 + 紧急卡片 + 定期 check-in + AI 远程协助”设计接口，承接学生在外期间的生活支持。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载在外支持 landing 页 | landing 页加载 | GET | `/api/v1/international/abroad-life/page-data` |
| 新建支持工单 | 顶部主按钮 | POST | `/api/v1/international/abroad-life/support-tickets` |
| 查看工单详情 | 列表卡点击 | GET | `/api/v1/international/abroad-life/support-tickets/{ticket_id}` |
| 打开生活指南 | 资源区点击 | GET | `/api/v1/international/abroad-life/life-guides/{guide_id}` |
| 查看紧急卡片 | 紧急入口按钮 | GET | `/api/v1/international/abroad-life/emergency-cards/{card_id}` |
| 提交定期 check-in | 状态面板按钮 | POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}/check-ins` |
| 升级为紧急事件 | 工单按钮 | POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}:escalate` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}/chat` |

## 3. 核心资源模型

- `support_tickets`: 在外生活支持工单
- `life_guides`: 生活指南
- `emergency_cards`: 紧急联络与处置卡片

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/abroad-life/page-data` | 首屏聚合：支持状态、地区风险、紧急入口 |
| GET | `/api/v1/international/abroad-life/support-tickets` | 工单列表 |
| POST | `/api/v1/international/abroad-life/support-tickets` | 创建工单 |
| GET | `/api/v1/international/abroad-life/support-tickets/{ticket_id}` | 工单详情 |
| PATCH | `/api/v1/international/abroad-life/support-tickets/{ticket_id}` | 更新状态、支持等级 |
| GET | `/api/v1/international/abroad-life/life-guides` | 生活指南列表 |
| GET | `/api/v1/international/abroad-life/life-guides/{guide_id}` | 指南详情 |
| GET | `/api/v1/international/abroad-life/emergency-cards/{card_id}` | 紧急卡片详情 |
| POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}/check-ins` | 新增 check-in |
| POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}:escalate` | 升级为紧急事件 |
| GET | `/api/v1/international/abroad-life/support-tickets/{ticket_id}/messages` | 对话历史 |
| POST | `/api/v1/international/abroad-life/support-tickets/{ticket_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "王小花",
  "country": "Finland",
  "topic": "accommodation",
  "support_level": "normal"
}
```

```json
{
  "id": "ticket_001",
  "student_name": "王小花",
  "status": "open",
  "support_level": "normal",
  "country": "Finland"
}
```

## 6. SSE 对话流

- `POST /api/v1/international/abroad-life/support-tickets/{ticket_id}/chat`
- `context` 建议包含：`country`、`guide_ids`、`emergency_level`
- 场景：生成求助建议、梳理应急步骤、压缩给老师的情况说明

## 7. 状态枚举与筛选条件

- `support_tickets.status`: `open` | `in_progress` | `resolved` | `escalated` | `archived`
- `support_tickets.support_level`: `normal` | `priority` | `critical`
- 筛选：
  - `keyword`
  - `status`
  - `country`
  - `support_level`

## 8. 错误与权限说明

- `403`：非支持团队或学生本人不可查看私有工单
- `409`：已升级紧急事件不可重复升级
- `422`：缺少国家或当前状况时不可自动匹配生活指南
