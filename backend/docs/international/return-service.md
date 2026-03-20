# 国际交流 - 回国归档与返校服务接口

## 1. 功能目标

围绕“返校案例 + 报销与归档 + 经验沉淀 + 反思记录 + AI 收尾助手”设计接口，支撑学生回国后的材料归档、报销与经验沉淀。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载回国服务 landing 页 | landing 页加载 | GET | `/api/v1/international/return-service/page-data` |
| 新建返校案例 | 顶部主按钮 | POST | `/api/v1/international/return-service/return-cases` |
| 查看案例详情 | 列表卡点击 | GET | `/api/v1/international/return-service/return-cases/{case_id}` |
| 提交报销单 | 报销区按钮 | POST | `/api/v1/international/return-service/reimbursements` |
| 归档材料 | 归档区按钮 | POST | `/api/v1/international/return-service/archives` |
| 提交经验反思 | 沉淀区按钮 | POST | `/api/v1/international/return-service/reflections` |
| 确认结案 | 顶部按钮 | POST | `/api/v1/international/return-service/return-cases/{case_id}:close` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/return-service/return-cases/{case_id}/chat` |

## 3. 核心资源模型

- `return_cases`: 返校主案例
- `reimbursements`: 报销记录
- `archives`: 归档材料
- `reflections`: 经验反思与回顾

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/return-service/page-data` | 首屏聚合：返校事项、报销状态、沉淀清单 |
| GET | `/api/v1/international/return-service/return-cases` | 案例列表 |
| POST | `/api/v1/international/return-service/return-cases` | 创建返校案例 |
| GET | `/api/v1/international/return-service/return-cases/{case_id}` | 案例详情 |
| PATCH | `/api/v1/international/return-service/return-cases/{case_id}` | 更新状态、负责人 |
| POST | `/api/v1/international/return-service/reimbursements` | 新建报销记录 |
| PATCH | `/api/v1/international/return-service/reimbursements/{reimbursement_id}` | 更新报销状态 |
| POST | `/api/v1/international/return-service/archives` | 新增归档材料 |
| POST | `/api/v1/international/return-service/reflections` | 新增反思记录 |
| PATCH | `/api/v1/international/return-service/reflections/{reflection_id}` | 更新反思 |
| POST | `/api/v1/international/return-service/return-cases/{case_id}:close` | 结案 |
| GET | `/api/v1/international/return-service/return-cases/{case_id}/messages` | 对话历史 |
| POST | `/api/v1/international/return-service/return-cases/{case_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "陈大伟",
  "program_id": "program_001",
  "return_date": "2026-02-18",
  "school": "University of Helsinki"
}
```

```json
{
  "id": "return_001",
  "student_name": "陈大伟",
  "status": "open",
  "reimbursement_status": "pending",
  "archive_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/international/return-service/return-cases/{case_id}/chat`
- `context` 建议包含：`reimbursement_ids`、`archive_ids`、`reflection_stage`
- 场景：整理返校事项、生成经验总结、解释报销缺件

## 7. 状态枚举与筛选条件

- `return_cases.status`: `open` | `collecting` | `closing` | `closed` | `archived`
- `reimbursements.status`: `pending` | `reviewing` | `approved` | `paid` | `rejected`
- 筛选：
  - `keyword`
  - `status`
  - `reimbursement_status`
  - `return_from`
  - `return_to`

## 8. 错误与权限说明

- `403`：非返校服务团队不可更改报销状态
- `409`：存在未完成报销或归档时不可结案
- `422`：缺少出访证明或票据时报销记录校验失败
