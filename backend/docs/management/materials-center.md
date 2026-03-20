# 助管 - 材料与表单管理接口

## 1. 功能目标

围绕“材料清单总览 + 模板库 + 审核状态表 + AI 补件建议”设计接口，用于统一管理学生提交材料、模板版本与审核闭环。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载材料中心首页 | landing 页加载 | GET | `/api/v1/management/materials-center/page-data` |
| 新建材料集合 | 顶部主按钮 | POST | `/api/v1/management/materials-center/collections` |
| 下载模板 | 模板卡按钮 | GET | `/api/v1/management/materials-center/material-items/{item_id}` |
| 提交材料项 | 表单提交按钮 | POST | `/api/v1/management/materials-center/material-items` |
| 更新审核状态 | 审核面板按钮 | PATCH | `/api/v1/management/materials-center/review-status/{review_id}` |
| 发起补件 | 审核面板按钮 | POST | `/api/v1/management/materials-center/review-status/{review_id}:request-resubmit` |
| 批量导出缺件清单 | 列表页按钮 | POST | `/api/v1/management/materials-center/collections/{collection_id}:export-missing` |
| AI 生成补件说明 | 侧边对话区 | POST | `/api/v1/management/materials-center/collections/{collection_id}/chat` |

## 3. 核心资源模型

- `collections`: 一批业务材料集合，如“交换报名材料”“奖学金申请材料”
- `material_items`: 单个材料项，包含模板、必交标记、样例说明
- `review_status`: 审核状态，包含提交人、审核结论、补件要求

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/management/materials-center/page-data` | 材料中心首屏数据 |
| GET | `/api/v1/management/materials-center/collections` | 材料集合列表 |
| POST | `/api/v1/management/materials-center/collections` | 创建材料集合 |
| GET | `/api/v1/management/materials-center/collections/{collection_id}` | 集合详情 |
| PATCH | `/api/v1/management/materials-center/collections/{collection_id}` | 更新集合配置 |
| DELETE | `/api/v1/management/materials-center/collections/{collection_id}` | 删除集合 |
| GET | `/api/v1/management/materials-center/material-items` | 材料项列表 |
| POST | `/api/v1/management/materials-center/material-items` | 新增材料项 |
| GET | `/api/v1/management/materials-center/material-items/{item_id}` | 材料项详情/模板信息 |
| PATCH | `/api/v1/management/materials-center/material-items/{item_id}` | 更新材料项 |
| PATCH | `/api/v1/management/materials-center/review-status/{review_id}` | 更新审核状态 |
| POST | `/api/v1/management/materials-center/review-status/{review_id}:request-resubmit` | 发起补件 |
| POST | `/api/v1/management/materials-center/collections/{collection_id}:export-missing` | 导出缺件清单 |
| GET | `/api/v1/management/materials-center/collections/{collection_id}/messages` | 对话历史 |
| POST | `/api/v1/management/materials-center/collections/{collection_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "name": "2026 春季交换报名材料",
  "business_type": "exchange_application",
  "owner_name": "国际处",
  "required_item_count": 6
}
```

```json
{
  "id": "col_001",
  "name": "2026 春季交换报名材料",
  "status": "active",
  "required_item_count": 6,
  "submitted_count": 112,
  "missing_count": 13
}
```

## 6. SSE 对话流

- `POST /api/v1/management/materials-center/collections/{collection_id}/chat`
- 典型上下文：`review_id`、`material_item_ids`、`policy_refs`
- 典型用途：生成补件通知、解释模板填写规则、压缩审核意见

## 7. 状态枚举与筛选条件

- `collections.status`: `draft` | `active` | `closed` | `archived`
- `review_status.status`: `pending` | `approved` | `need_resubmit` | `rejected`
- 筛选：
  - `keyword`
  - `business_type`
  - `status`
  - `owner_id`

## 8. 错误与权限说明

- `403`：非集合维护人不可修改模板或审核结果
- `409`：已关闭集合不可再新增材料项
- `422`：缺少必填模板说明时不可将材料项设为必交
