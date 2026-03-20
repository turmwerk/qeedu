# 国际交流 - 交换与访学项目中心接口

## 1. 功能目标

围绕“项目总目录 + 收藏池 + 批量比较 + 摘要卡片 + AI 讨论”设计接口，支撑项目中心把合作院校信息、申请门槛和讨论材料统一到一个入口。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载项目中心 landing 页 | landing 页加载 | GET | `/api/v1/international/exchange-hub/page-data` |
| 查看项目列表 | 列表页加载 | GET | `/api/v1/international/exchange-hub/programs` |
| 收藏项目 | 项目卡按钮 | POST | `/api/v1/international/exchange-hub/favorites` |
| 取消收藏 | 收藏区按钮 | DELETE | `/api/v1/international/exchange-hub/favorites/{favorite_id}` |
| 加入批量比较 | 项目卡按钮 | POST | `/api/v1/international/exchange-hub/compare-batches` |
| 打开项目详情 | 项目卡点击 | GET | `/api/v1/international/exchange-hub/programs/{program_id}` |
| 生成项目摘要 | 详情页按钮 | POST | `/api/v1/international/exchange-hub/programs/{program_id}:brief` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/exchange-hub/programs/{program_id}/chat` |

## 3. 核心资源模型

- `programs`: 交换项目，包含院校、地区、学期、门槛、名额
- `favorites`: 收藏项目池
- `compare_batches`: 批量比较集合，包含一组候选项目与比较结论

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/exchange-hub/page-data` | 首屏聚合：推荐项目、地区分布、快捷动作 |
| GET | `/api/v1/international/exchange-hub/programs` | 项目列表 |
| POST | `/api/v1/international/exchange-hub/programs` | 手工录入项目 |
| GET | `/api/v1/international/exchange-hub/programs/{program_id}` | 项目详情 |
| PATCH | `/api/v1/international/exchange-hub/programs/{program_id}` | 更新项目信息 |
| DELETE | `/api/v1/international/exchange-hub/programs/{program_id}` | 删除项目 |
| GET | `/api/v1/international/exchange-hub/favorites` | 收藏列表 |
| POST | `/api/v1/international/exchange-hub/favorites` | 新增收藏 |
| DELETE | `/api/v1/international/exchange-hub/favorites/{favorite_id}` | 取消收藏 |
| GET | `/api/v1/international/exchange-hub/compare-batches` | 比较批次列表 |
| POST | `/api/v1/international/exchange-hub/compare-batches` | 新建比较批次 |
| POST | `/api/v1/international/exchange-hub/programs/{program_id}:brief` | 生成项目摘要 |
| GET | `/api/v1/international/exchange-hub/programs/{program_id}/messages` | 对话历史 |
| POST | `/api/v1/international/exchange-hub/programs/{program_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "program_name": "University of Helsinki Exchange",
  "region": "Europe",
  "term": "2026-fall",
  "gpa_requirement": "3.5/4.0",
  "language_requirement": "IELTS 6.5"
}
```

```json
{
  "id": "program_001",
  "program_name": "University of Helsinki Exchange",
  "status": "active",
  "favorite_count": 18,
  "seat_count": 3
}
```

## 6. SSE 对话流

- `POST /api/v1/international/exchange-hub/programs/{program_id}/chat`
- `context` 建议包含：`compare_batch_id`、`profile_id`、`program_fields`
- 场景：生成项目摘要、解释门槛、比较风险点

## 7. 状态枚举与筛选条件

- `programs.status`: `active` | `paused` | `expired` | `archived`
- `compare_batches.status`: `draft` | `generated` | `locked`
- 筛选：
  - `keyword`
  - `region`
  - `term`
  - `status`
  - `tag`

## 8. 错误与权限说明

- `403`：无国际交流权限的普通用户不可编辑项目库
- `409`：已锁定比较批次不可重复添加项目
- `422`：项目核心门槛字段缺失时不可生成摘要
