# 国际交流 - 来华支持接口

## 1. 功能目标

围绕“来华支持案例 + 服务指南 + FAQ + 到校任务 + AI 双语答疑”设计接口，承接 incoming students 的报到、住宿、校园卡、选课与首周适应支持。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载来华支持 landing 页 | landing 页加载 | GET | `/api/v1/international/welcome-portal/page-data` |
| 新建支持案例 | 顶部主按钮 | POST | `/api/v1/international/welcome-portal/support-cases` |
| 查看案例详情 | 列表卡点击 | GET | `/api/v1/international/welcome-portal/support-cases/{case_id}` |
| 打开服务指南 | 资源卡点击 | GET | `/api/v1/international/welcome-portal/service-guides/{guide_id}` |
| 新增 FAQ | FAQ 管理按钮 | POST | `/api/v1/international/welcome-portal/faq` |
| 指派到校任务 | 案例侧栏按钮 | POST | `/api/v1/international/welcome-portal/support-cases/{case_id}/tasks` |
| 发送双语回复 | 快捷动作按钮 | POST | `/api/v1/international/welcome-portal/support-cases/{case_id}:send-bilingual-reply` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/welcome-portal/support-cases/{case_id}/chat` |

## 3. 核心资源模型

- `support_cases`: 来华支持案例
- `service_guides`: 服务指南
- `faq`: FAQ 条目

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/welcome-portal/page-data` | 首屏聚合：支持案例、FAQ 热点、首周任务 |
| GET | `/api/v1/international/welcome-portal/support-cases` | 案例列表 |
| POST | `/api/v1/international/welcome-portal/support-cases` | 创建支持案例 |
| GET | `/api/v1/international/welcome-portal/support-cases/{case_id}` | 案例详情 |
| PATCH | `/api/v1/international/welcome-portal/support-cases/{case_id}` | 更新状态、负责人 |
| GET | `/api/v1/international/welcome-portal/service-guides` | 服务指南列表 |
| GET | `/api/v1/international/welcome-portal/service-guides/{guide_id}` | 服务指南详情 |
| GET | `/api/v1/international/welcome-portal/faq` | FAQ 列表 |
| POST | `/api/v1/international/welcome-portal/faq` | 新增 FAQ |
| PATCH | `/api/v1/international/welcome-portal/faq/{faq_id}` | 更新 FAQ |
| POST | `/api/v1/international/welcome-portal/support-cases/{case_id}/tasks` | 新增到校任务 |
| POST | `/api/v1/international/welcome-portal/support-cases/{case_id}:send-bilingual-reply` | 发送双语回复 |
| GET | `/api/v1/international/welcome-portal/support-cases/{case_id}/messages` | 对话历史 |
| POST | `/api/v1/international/welcome-portal/support-cases/{case_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "Alice Tan",
  "country": "Singapore",
  "arrival_stage": "before_arrival",
  "support_topic": "dormitory_and_registration"
}
```

```json
{
  "id": "welcome_001",
  "student_name": "Alice Tan",
  "status": "open",
  "arrival_stage": "before_arrival",
  "task_count": 3
}
```

## 6. SSE 对话流

- `POST /api/v1/international/welcome-portal/support-cases/{case_id}/chat`
- `context` 建议包含：`faq_ids`、`guide_ids`、`preferred_language`
- 场景：生成双语答复、解释报到流程、整理首周安排

## 7. 状态枚举与筛选条件

- `support_cases.status`: `open` | `in_progress` | `resolved` | `archived`
- `faq.status`: `draft` | `active` | `deprecated`
- 筛选：
  - `keyword`
  - `arrival_stage`
  - `status`
  - `country`

## 8. 错误与权限说明

- `403`：非来华支持团队成员不可修改案例
- `409`：已解决案例不可再次指派任务，需重新打开
- `422`：缺少语言偏好时不可直接发送双语回复
