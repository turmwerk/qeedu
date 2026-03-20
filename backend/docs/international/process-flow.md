# 国际交流 - 申请流程助手接口

## 1. 功能目标

围绕“流程计划 + 节点任务 + 里程碑时间线 + 提醒与风险修复”设计接口，支撑流程助手把校内审批、平台提交、签证与补件串成单一工作台。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载流程 landing 页 | landing 页加载 | GET | `/api/v1/international/process-flow/page-data` |
| 创建流程计划 | 顶部主按钮 | POST | `/api/v1/international/process-flow/plans` |
| AI 生成节点清单 | 计划创建弹窗 | POST | `/api/v1/international/process-flow/plans/{plan_id}/tasks:generate` |
| 查看计划详情 | 记录卡点击 | GET | `/api/v1/international/process-flow/plans/{plan_id}` |
| 更新任务状态 | 任务卡操作 | PATCH | `/api/v1/international/process-flow/tasks/{task_id}` |
| 添加里程碑 | 时间线按钮 | POST | `/api/v1/international/process-flow/milestones` |
| 发送提醒 | 风险区按钮 | POST | `/api/v1/international/process-flow/reminders` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/process-flow/plans/{plan_id}/chat` |

## 3. 核心资源模型

- `plans`: 流程计划，绑定学生、项目、当前阶段
- `tasks`: 节点任务，包含负责人、截止时间、前置依赖
- `milestones`: 里程碑时间点
- `reminders`: 提醒记录

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/process-flow/page-data` | 首屏聚合：流程概览、风险节点、快捷动作 |
| GET | `/api/v1/international/process-flow/plans` | 计划列表 |
| POST | `/api/v1/international/process-flow/plans` | 创建计划 |
| GET | `/api/v1/international/process-flow/plans/{plan_id}` | 计划详情 |
| PATCH | `/api/v1/international/process-flow/plans/{plan_id}` | 更新阶段、负责人 |
| DELETE | `/api/v1/international/process-flow/plans/{plan_id}` | 删除计划 |
| POST | `/api/v1/international/process-flow/plans/{plan_id}/tasks:generate` | AI 生成任务清单 |
| PATCH | `/api/v1/international/process-flow/tasks/{task_id}` | 更新任务状态 |
| POST | `/api/v1/international/process-flow/milestones` | 创建里程碑 |
| PATCH | `/api/v1/international/process-flow/milestones/{milestone_id}` | 更新里程碑 |
| POST | `/api/v1/international/process-flow/reminders` | 创建提醒 |
| GET | `/api/v1/international/process-flow/plans/{plan_id}/messages` | 对话历史 |
| POST | `/api/v1/international/process-flow/plans/{plan_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "张同学",
  "program_id": "program_001",
  "plan_name": "2026 秋季交换申请流程"
}
```

```json
{
  "id": "plan_001",
  "plan_name": "2026 秋季交换申请流程",
  "status": "active",
  "task_count": 12,
  "risk_count": 2
}
```

## 6. SSE 对话流

- `POST /api/v1/international/process-flow/plans/{plan_id}/chat`
- `context` 建议包含：`task_ids`、`milestone_ids`、`blocked_reason`
- 场景：识别堵点、重排节点、生成补救动作和提醒文案

## 7. 状态枚举与筛选条件

- `plans.status`: `draft` | `active` | `blocked` | `completed` | `archived`
- `tasks.status`: `todo` | `doing` | `done` | `blocked`
- `milestones.status`: `upcoming` | `done` | `missed`
- 筛选：
  - `keyword`
  - `status`
  - `student_id`
  - `program_id`

## 8. 错误与权限说明

- `403`：非计划相关负责老师不可调整任务
- `409`：存在未完成前置节点时不可将计划标记完成
- `422`：缺少项目或学生信息时不可创建计划
