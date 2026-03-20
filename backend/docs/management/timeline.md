# 助管 - 时间节点管理接口

## 1. 功能目标

围绕“年度时间轴 + 节点卡片 + 提醒策略 + 冲突消解”设计接口，把报名、补件、审批、面试、发布等节点统一编排。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载时间轴首页 | landing 页加载 | GET | `/api/v1/management/timeline/page-data` |
| 新建时间轴 | 顶部主按钮 | POST | `/api/v1/management/timeline/timelines` |
| 添加事件 | 时间轴详情按钮 | POST | `/api/v1/management/timeline/events` |
| 更新事件日期 | 节点编辑弹窗 | PATCH | `/api/v1/management/timeline/events/{event_id}` |
| 发送提醒 | 节点操作按钮 | POST | `/api/v1/management/timeline/reminders` |
| 查看冲突 | 风险提示按钮 | GET | `/api/v1/management/timeline/conflicts` |
| 标记冲突已处理 | 冲突面板按钮 | POST | `/api/v1/management/timeline/conflicts/{conflict_id}:resolve` |
| AI 优化排期 | 右侧对话区 | POST | `/api/v1/management/timeline/timelines/{timeline_id}/chat` |

## 3. 核心资源模型

- `timelines`: 时间轴主实体，包含学年、业务域、负责人
- `events`: 单个节点事件，包含日期、优先级、状态
- `reminders`: 提醒记录，包含发送渠道、发送时间、对象
- `conflicts`: 节点冲突，包含冲突类型、影响范围、解决方案

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/timeline/page-data` | 首屏聚合：重点节点、提醒统计、冲突摘要 |
| GET | `/api/v1/management/timeline/timelines` | 时间轴列表 |
| POST | `/api/v1/management/timeline/timelines` | 创建时间轴 |
| GET | `/api/v1/management/timeline/timelines/{timeline_id}` | 时间轴详情 |
| PATCH | `/api/v1/management/timeline/timelines/{timeline_id}` | 更新范围、负责人 |
| DELETE | `/api/v1/management/timeline/timelines/{timeline_id}` | 删除时间轴 |
| POST | `/api/v1/management/timeline/events` | 创建节点 |
| PATCH | `/api/v1/management/timeline/events/{event_id}` | 更新节点 |
| DELETE | `/api/v1/management/timeline/events/{event_id}` | 删除节点 |
| POST | `/api/v1/management/timeline/reminders` | 创建提醒 |
| GET | `/api/v1/management/timeline/conflicts` | 冲突列表 |
| POST | `/api/v1/management/timeline/conflicts/{conflict_id}:resolve` | 解决冲突 |
| GET | `/api/v1/management/timeline/timelines/{timeline_id}/messages` | 对话历史 |
| POST | `/api/v1/management/timeline/timelines/{timeline_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "name": "2026 春季国际交流事务时间轴",
  "scope": "international",
  "year_term": "2026-spring",
  "owner_name": "国际处"
}
```

```json
{
  "id": "timeline_001",
  "name": "2026 春季国际交流事务时间轴",
  "status": "active",
  "event_count": 18,
  "conflict_count": 2
}
```

## 6. SSE 对话流

- `POST /api/v1/management/timeline/timelines/{timeline_id}/chat`
- `context` 建议包含：`event_ids`、`conflict_ids`、`audience`
- 场景：重排节点节奏、生成提醒文案、识别高风险时间段

## 7. 状态枚举与筛选条件

- `timelines.status`: `draft` | `active` | `closed` | `archived`
- `events.status`: `upcoming` | `ongoing` | `completed` | `missed`
- `conflicts.status`: `open` | `resolved` | `ignored`
- 筛选：
  - `scope`
  - `status`
  - `priority`
  - `date_from`
  - `date_to`

## 8. 错误与权限说明

- `403`：非时间轴维护人不可调整核心节点
- `409`：已关闭时间轴不可再新增提醒
- `422`：事件日期早于前置节点时返回业务错误
