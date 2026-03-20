# 助管 - 事务处理助手接口

## 1. 功能目标

围绕“事务卡片 + 步骤泳道 + 材料侧栏 + AI 纠偏对话”设计接口，支撑辅导员和秘书老师对请假、补件、申报、审批等事务进行拆解、分派、跟催和异常处理。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 打开事务总览 | landing 页加载 | GET | `/api/v1/management/process-assistant/page-data` |
| 新建事务案例 | 顶部主按钮 | POST | `/api/v1/management/process-assistant/cases` |
| AI 生成步骤 | 案例创建弹窗 | POST | `/api/v1/management/process-assistant/cases/{case_id}/steps:generate` |
| 进入案例详情 | 事务卡主按钮 | GET | `/api/v1/management/process-assistant/cases/{case_id}` |
| 指派负责人 | 步骤卡操作按钮 | PATCH | `/api/v1/management/process-assistant/steps/{step_id}` |
| 标记步骤完成 | 步骤卡勾选 | POST | `/api/v1/management/process-assistant/steps/{step_id}:complete` |
| 请求补件 | 异常处理按钮 | POST | `/api/v1/management/process-assistant/cases/{case_id}/attachments:request` |
| 上传附件 | 材料区上传 | POST | `/api/v1/management/process-assistant/cases/{case_id}/attachments` |
| 记录异常说明 | 风险侧栏保存 | POST | `/api/v1/management/process-assistant/cases/{case_id}/exceptions` |
| 继续对话求解 | `ChatDialog` 发送 | POST | `/api/v1/management/process-assistant/cases/{case_id}/chat` |

## 3. 核心资源模型

- `cases`: 事务主单，包含业务类型、发起人、当前阶段、优先级
- `steps`: 事务步骤，包含负责人、截止时间、前置依赖、完成状态
- `attachments`: 材料与附件，包含材料类型、是否必交、审核结论
- `exceptions`: 异常记录，包含异常类型、处置建议、恢复状态

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/process-assistant/page-data` | 首屏聚合：事务分布、风险案例、快捷入口 |
| GET | `/api/v1/management/process-assistant/cases` | 事务列表 |
| POST | `/api/v1/management/process-assistant/cases` | 创建事务案例 |
| GET | `/api/v1/management/process-assistant/cases/{case_id}` | 案例详情 |
| PATCH | `/api/v1/management/process-assistant/cases/{case_id}` | 更新阶段、优先级、说明 |
| DELETE | `/api/v1/management/process-assistant/cases/{case_id}` | 删除事务案例 |
| POST | `/api/v1/management/process-assistant/cases/{case_id}/steps:generate` | AI 拆解步骤 |
| GET | `/api/v1/management/process-assistant/cases/{case_id}/steps` | 步骤列表 |
| PATCH | `/api/v1/management/process-assistant/steps/{step_id}` | 更新负责人、截止时间 |
| POST | `/api/v1/management/process-assistant/steps/{step_id}:complete` | 完成步骤 |
| POST | `/api/v1/management/process-assistant/cases/{case_id}/attachments` | 上传附件元数据 |
| POST | `/api/v1/management/process-assistant/cases/{case_id}/attachments:request` | 发起补件请求 |
| POST | `/api/v1/management/process-assistant/cases/{case_id}/exceptions` | 新增异常记录 |
| GET | `/api/v1/management/process-assistant/cases/{case_id}/messages` | 获取对话历史 |
| POST | `/api/v1/management/process-assistant/cases/{case_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "case_type": "exchange_application",
  "title": "2026 春季交换院内审批",
  "requester_name": "王同学",
  "priority": "high",
  "description": "需要学院审核成绩单、导师意见和推荐顺序。"
}
```

```json
{
  "id": "case_001",
  "case_type": "exchange_application",
  "title": "2026 春季交换院内审批",
  "status": "in_progress",
  "priority": "high",
  "current_step_count": 5,
  "risk_count": 1
}
```

## 6. SSE 对话流

- `POST /api/v1/management/process-assistant/cases/{case_id}/chat`
- `context` 建议包含：`case_type`、`current_step_id`、`exception_ids`
- 典型用途：生成补救动作、改写通知口径、解释材料要求

## 7. 状态枚举与筛选条件

- `cases.status`: `draft` | `in_progress` | `blocked` | `completed` | `cancelled`
- `steps.status`: `todo` | `doing` | `done` | `skipped`
- `attachments.review_status`: `pending` | `accepted` | `rejected` | `need_resubmit`
- 筛选：
  - `keyword`
  - `case_type`
  - `status`
  - `priority`
  - `owner_id`

## 8. 错误与权限说明

- 仅案例相关的辅导员、秘书与管理员可改写
- `409`：存在未完成前置步骤时，禁止直接完成后续步骤
- `422`：必交材料未齐全时，禁止将案例标记为完成
