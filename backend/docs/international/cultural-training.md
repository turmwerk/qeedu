# 国际交流 - 跨文化培训接口

## 1. 功能目标

围绕“培训画像 + 模块学习路径 + 风险备注 + 适应度建议 + AI 辅导”设计接口，支撑跨文化培训列表与详情页。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载培训 landing 页 | landing 页加载 | GET | `/api/v1/international/cultural-training/page-data` |
| 新建培训画像 | 顶部主按钮 | POST | `/api/v1/international/cultural-training/training-profiles` |
| 查看画像详情 | 列表卡点击 | GET | `/api/v1/international/cultural-training/training-profiles/{profile_id}` |
| 分配学习模块 | 模块面板按钮 | POST | `/api/v1/international/cultural-training/modules` |
| 更新模块完成度 | 学习清单勾选 | PATCH | `/api/v1/international/cultural-training/modules/{module_id}` |
| 添加风险备注 | 详情页侧栏 | POST | `/api/v1/international/cultural-training/risk-notes` |
| 生成适应建议 | 快捷动作按钮 | POST | `/api/v1/international/cultural-training/training-profiles/{profile_id}:generate-advice` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/cultural-training/training-profiles/{profile_id}/chat` |

## 3. 核心资源模型

- `training_profiles`: 培训画像
- `modules`: 培训模块
- `risk_notes`: 风险备注，记录文化冲突、沟通提醒和关注点

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/cultural-training/page-data` | 首屏聚合：画像分布、模块完成度、风险提醒 |
| GET | `/api/v1/international/cultural-training/training-profiles` | 画像列表 |
| POST | `/api/v1/international/cultural-training/training-profiles` | 创建画像 |
| GET | `/api/v1/international/cultural-training/training-profiles/{profile_id}` | 画像详情 |
| PATCH | `/api/v1/international/cultural-training/training-profiles/{profile_id}` | 更新适应阶段、备注 |
| GET | `/api/v1/international/cultural-training/modules` | 模块列表 |
| POST | `/api/v1/international/cultural-training/modules` | 创建或分配模块 |
| PATCH | `/api/v1/international/cultural-training/modules/{module_id}` | 更新模块完成度 |
| POST | `/api/v1/international/cultural-training/risk-notes` | 新增风险备注 |
| PATCH | `/api/v1/international/cultural-training/risk-notes/{note_id}` | 更新风险备注 |
| POST | `/api/v1/international/cultural-training/training-profiles/{profile_id}:generate-advice` | 生成适应建议 |
| GET | `/api/v1/international/cultural-training/training-profiles/{profile_id}/messages` | 对话历史 |
| POST | `/api/v1/international/cultural-training/training-profiles/{profile_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "赵小美",
  "country": "Canada",
  "profile_type": "outbound",
  "current_stage": "before_departure"
}
```

```json
{
  "id": "ctp_001",
  "student_name": "赵小美",
  "status": "active",
  "module_completion_rate": 0.25,
  "risk_note_count": 1
}
```

## 6. SSE 对话流

- `POST /api/v1/international/cultural-training/training-profiles/{profile_id}/chat`
- `context` 建议包含：`module_ids`、`risk_note_ids`、`profile_type`
- 场景：生成文化适应建议、模拟沟通场景、解释风险点

## 7. 状态枚举与筛选条件

- `training_profiles.status`: `active` | `completed` | `paused` | `archived`
- `modules.status`: `todo` | `doing` | `done`
- `risk_notes.level`: `low` | `medium` | `high`
- 筛选：
  - `keyword`
  - `status`
  - `profile_type`
  - `country`

## 8. 错误与权限说明

- `403`：非培训负责团队不可修改画像
- `409`：已完成画像不可再次分配新模块
- `422`：未配置适用对象时不可生成适应建议
