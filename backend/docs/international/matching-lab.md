# 国际交流 - 智能项目匹配与申请决策接口

## 1. 功能目标

围绕“申请人画像 + 推荐候选 + 比较面板 + 决策说明稿 + AI 咨询”设计接口，帮助学生和老师完成项目匹配与优先级决策。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载匹配 landing 页 | landing 页加载 | GET | `/api/v1/international/matching-lab/page-data` |
| 新建分析任务 | 顶部主按钮 | POST | `/api/v1/international/matching-lab/analyses` |
| 保存申请人画像 | 表单提交 | POST | `/api/v1/international/matching-lab/applicant-profiles` |
| 运行推荐 | “生成推荐”按钮 | POST | `/api/v1/international/matching-lab/recommendations` |
| 查看候选明细 | 候选卡片点击 | GET | `/api/v1/international/matching-lab/recommendations/{recommendation_id}` |
| 锁定优先级 | 决策面板按钮 | POST | `/api/v1/international/matching-lab/analyses/{analysis_id}:lock` |
| 导出说明稿 | 说明稿按钮 | POST | `/api/v1/international/matching-lab/analyses/{analysis_id}:export-rationale` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/matching-lab/analyses/{analysis_id}/chat` |

## 3. 核心资源模型

- `analyses`: 匹配分析任务
- `applicant_profiles`: 申请人画像，包含 GPA、语言、预算、偏好与约束
- `recommendations`: 推荐结果，包含分数、风险、优先级与解释

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/matching-lab/page-data` | 首屏聚合：最近分析、候选分布、快捷动作 |
| GET | `/api/v1/international/matching-lab/analyses` | 分析任务列表 |
| POST | `/api/v1/international/matching-lab/analyses` | 创建分析任务 |
| GET | `/api/v1/international/matching-lab/analyses/{analysis_id}` | 分析详情 |
| PATCH | `/api/v1/international/matching-lab/analyses/{analysis_id}` | 更新决策说明与状态 |
| POST | `/api/v1/international/matching-lab/analyses/{analysis_id}:lock` | 锁定优先级结果 |
| GET | `/api/v1/international/matching-lab/applicant-profiles` | 画像列表 |
| POST | `/api/v1/international/matching-lab/applicant-profiles` | 新增画像 |
| PATCH | `/api/v1/international/matching-lab/applicant-profiles/{profile_id}` | 更新画像 |
| GET | `/api/v1/international/matching-lab/recommendations` | 推荐列表 |
| POST | `/api/v1/international/matching-lab/recommendations` | 运行推荐 |
| GET | `/api/v1/international/matching-lab/recommendations/{recommendation_id}` | 推荐详情 |
| POST | `/api/v1/international/matching-lab/analyses/{analysis_id}:export-rationale` | 导出说明稿 |
| GET | `/api/v1/international/matching-lab/analyses/{analysis_id}/messages` | 对话历史 |
| POST | `/api/v1/international/matching-lab/analyses/{analysis_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "张明 2026 秋季交换匹配",
  "profile_id": "profile_001",
  "target_term": "2026-fall"
}
```

```json
{
  "id": "analysis_001",
  "title": "张明 2026 秋季交换匹配",
  "status": "draft",
  "recommendation_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/international/matching-lab/analyses/{analysis_id}/chat`
- `context` 建议包含：`profile_id`、`recommendation_ids`、`decision_stage`
- 场景：解释推荐理由、调整偏好权重、生成家长/导师沟通说明

## 7. 状态枚举与筛选条件

- `analyses.status`: `draft` | `generated` | `reviewing` | `locked` | `archived`
- `recommendations.risk_level`: `low` | `medium` | `high`
- 筛选：
  - `keyword`
  - `status`
  - `target_term`
  - `risk_level`

## 8. 错误与权限说明

- `403`：非学生本人、导师或管理老师不可查看画像
- `409`：已锁定分析不可再次覆盖推荐顺序
- `422`：画像缺少 GPA、语言或预算信息时不可运行推荐
