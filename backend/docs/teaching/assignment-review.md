# 助教 - 作业批改与反馈接口

## 1. 功能目标

围绕“批改任务队列 + rubric 面板 + 学生提交详情 + 反馈对话”设计接口，支撑助教在单页工作区里完成任务创建、批量批改、反馈生成、人工复核与回写学生端。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 查看任务列表 | landing 页主按钮 | GET | `/api/v1/teaching/assignment-review/page-data` |
| 新建批改任务 | 列表页主按钮 | POST | `/api/v1/teaching/assignment-review/assignments` |
| 进入批改 | 任务卡主按钮 | GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}` |
| 查看 rubric | 任务卡次按钮 | GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/rubrics` |
| 拉取提交列表 | 详情页加载 | GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/submissions` |
| 生成反馈草稿 | 提交详情右侧操作 | POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/submissions/{submission_id}/feedback-drafts` |
| 人工修改反馈 | 反馈草稿编辑区 | PATCH | `/api/v1/teaching/assignment-review/feedback-drafts/{draft_id}` |
| 导出 rubric | 列表或详情页按钮 | POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/rubrics:export` |
| 回写学生端 | 反馈确认弹窗 | POST | `/api/v1/teaching/assignment-review/feedback-drafts/{draft_id}:publish` |
| 更新订正状态 | 详情页状态条 | PATCH | `/api/v1/teaching/assignment-review/submissions/{submission_id}/revision-status` |
| 继续对话润色 | `ChatDialog` 发送 | POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/chat` |

成功后页面需要同步更新任务状态、反馈草稿版本、提交计数和订正进度；失败时统一 toast 错误信息并保留当前编辑态。

## 3. 核心资源模型

- `assignments`
  - `id`
  - `course_name`
  - `title`
  - `status`
  - `priority`
  - `due_at`
  - `submission_count`
  - `reviewed_count`
- `submissions`
  - `id`
  - `student_id`
  - `student_name`
  - `score`
  - `auto_flags`
  - `revision_status`
- `rubrics`
  - `assignment_id`
  - `criteria[]`
  - `total_score`
- `feedback_drafts`
  - `id`
  - `submission_id`
  - `version`
  - `content`
  - `status`
- `revision_status`
  - `submission_id`
  - `status`
  - `comment`
  - `updated_at`

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/teaching/assignment-review/page-data` | 首屏聚合：任务概览、风险任务、快捷动作 |
| GET | `/api/v1/teaching/assignment-review/assignments` | 批改任务列表 |
| POST | `/api/v1/teaching/assignment-review/assignments` | 创建批改任务 |
| GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}` | 批改任务详情 |
| PATCH | `/api/v1/teaching/assignment-review/assignments/{assignment_id}` | 更新任务状态、截止时间、负责人 |
| DELETE | `/api/v1/teaching/assignment-review/assignments/{assignment_id}` | 删除任务 |
| GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/submissions` | 获取提交列表 |
| GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/rubrics` | 获取 rubric |
| PUT | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/rubrics` | 覆盖更新 rubric |
| POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/rubrics:export` | 导出 rubric |
| POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/submissions/{submission_id}/feedback-drafts` | 生成反馈草稿 |
| PATCH | `/api/v1/teaching/assignment-review/feedback-drafts/{draft_id}` | 编辑反馈草稿 |
| POST | `/api/v1/teaching/assignment-review/feedback-drafts/{draft_id}:publish` | 回写学生端 |
| PATCH | `/api/v1/teaching/assignment-review/submissions/{submission_id}/revision-status` | 更新订正状态 |
| GET | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/messages` | 获取对话历史 |
| POST | `/api/v1/teaching/assignment-review/assignments/{assignment_id}/chat` | SSE 对话 |

## 5. 请求响应示例

创建批改任务：

```json
{
  "course_name": "程序设计基础",
  "title": "第 4 次作业",
  "priority": "high",
  "due_at": "2026-03-20T23:59:00+08:00",
  "submission_count": 89
}
```

响应：

```json
{
  "id": "asg_001",
  "course_name": "程序设计基础",
  "title": "第 4 次作业",
  "status": "pending_review",
  "priority": "high",
  "due_at": "2026-03-20T23:59:00+08:00",
  "submission_count": 89,
  "reviewed_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/teaching/assignment-review/assignments/{assignment_id}/chat`
- 请求体：

```json
{
  "messages": [
    { "role": "user", "content": "请把反馈改得更具体一点，并加上自查建议。" }
  ],
  "context": {
    "resource_type": "assignment",
    "resource_id": "asg_001",
    "submission_id": "sub_014",
    "rubric_version": 3
  },
  "language": "zh-CN"
}
```

- 返回：兼容现有 SSE 增量文本流

## 7. 状态枚举与筛选条件

- `assignments.status`: `draft` | `pending_review` | `reviewing` | `published` | `archived`
- `feedback_drafts.status`: `generated` | `edited` | `approved` | `published`
- `revision_status.status`: `not_started` | `submitted_again` | `resolved` | `rejected`
- 列表筛选：
  - `keyword`
  - `status`
  - `priority`
  - `course_name`
  - `due_from`
  - `due_to`

## 8. 错误与权限说明

- 只有课程教师、助教和管理员可访问
- `403`：当前用户不属于该课程教学团队
- `409`：已发布反馈不可重复回写
- `422`：rubric 缺失或提交记录不完整时禁止生成反馈
