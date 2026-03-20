# 助管 - 数据统计与看板接口

## 1. 功能目标

围绕“指标卡 + 趋势图 + 异常告警 + AI 洞察会话”设计接口，让看板不仅能看，还能继续下钻、生成分析结论与后续行动建议。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载看板首页 | landing 页加载 | GET | `/api/v1/management/dashboard/page-data` |
| 切换指标维度 | 指标切换器 | GET | `/api/v1/management/dashboard/overview` |
| 查看趋势图 | 趋势标签切换 | GET | `/api/v1/management/dashboard/trends` |
| 打开异常告警 | 告警面板 | GET | `/api/v1/management/dashboard/alerts` |
| 新建洞察会话 | “生成分析”按钮 | POST | `/api/v1/management/dashboard/insight-sessions` |
| 刷新洞察结论 | 洞察卡按钮 | POST | `/api/v1/management/dashboard/insight-sessions/{session_id}:refresh` |
| 导出周报 | 导出按钮 | POST | `/api/v1/management/dashboard/insight-sessions/{session_id}:export` |
| 继续对话追问 | `ChatDialog` 发送 | POST | `/api/v1/management/dashboard/insight-sessions/{session_id}/chat` |

## 3. 核心资源模型

- `overview`: 首页指标摘要
- `trends`: 趋势序列数据
- `alerts`: 异常告警项
- `insight_sessions`: AI 洞察会话，沉淀周报、原因分析和行动建议

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/dashboard/page-data` | 首屏聚合：指标卡、趋势摘要、风险告警 |
| GET | `/api/v1/management/dashboard/overview` | 指标维度明细 |
| GET | `/api/v1/management/dashboard/trends` | 趋势数据 |
| GET | `/api/v1/management/dashboard/alerts` | 告警列表 |
| GET | `/api/v1/management/dashboard/insight-sessions` | 洞察会话列表 |
| POST | `/api/v1/management/dashboard/insight-sessions` | 创建洞察会话 |
| GET | `/api/v1/management/dashboard/insight-sessions/{session_id}` | 洞察详情 |
| PATCH | `/api/v1/management/dashboard/insight-sessions/{session_id}` | 更新结论标题、标签 |
| DELETE | `/api/v1/management/dashboard/insight-sessions/{session_id}` | 删除洞察会话 |
| POST | `/api/v1/management/dashboard/insight-sessions/{session_id}:refresh` | 重新生成结论 |
| POST | `/api/v1/management/dashboard/insight-sessions/{session_id}:export` | 导出周报 |
| GET | `/api/v1/management/dashboard/insight-sessions/{session_id}/messages` | 获取对话历史 |
| POST | `/api/v1/management/dashboard/insight-sessions/{session_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "scope": "weekly",
  "metric_keys": ["todo_count", "completion_rate", "overdue_count", "qa_volume"],
  "owner_group": "international_office"
}
```

```json
{
  "id": "insight_001",
  "title": "本周事务负载分析",
  "status": "generated",
  "summary": "逾期任务集中在补件环节，建议把缺件提醒前置 48 小时。",
  "created_at": "2026-03-20T09:20:00+08:00"
}
```

## 6. SSE 对话流

- `POST /api/v1/management/dashboard/insight-sessions/{session_id}/chat`
- `context` 建议包含：`metric_keys`、`scope`、`alert_ids`
- 典型用途：解释指标波动、生成周报摘要、输出行动清单

## 7. 状态枚举与筛选条件

- `insight_sessions.status`: `draft` | `generated` | `reviewed` | `archived`
- `alerts.level`: `info` | `warning` | `critical`
- 筛选：
  - `scope`
  - `owner_group`
  - `level`
  - `status`

## 8. 错误与权限说明

- `403`：用户无权查看当前组织范围数据
- `409`：已归档洞察会话不可刷新
- `422`：缺少指标维度时不可生成洞察
