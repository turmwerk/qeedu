# 国际交流 - 行前准备接口

## 1. 功能目标

围绕“行前案例 + 证件清单 + 文件包校验 + 风险提示 + AI 准备助手”设计接口，把签证、保险、住宿、行李与入境材料整理成连续工作流。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载行前准备 landing 页 | landing 页加载 | GET | `/api/v1/international/pre-departure/page-data` |
| 新建准备案例 | 顶部主按钮 | POST | `/api/v1/international/pre-departure/preparation-cases` |
| 生成清单 | 快捷动作按钮 | POST | `/api/v1/international/pre-departure/checklists` |
| 上传文件包 | 文件区上传按钮 | POST | `/api/v1/international/pre-departure/document-pack` |
| 校验文件包 | 校验按钮 | POST | `/api/v1/international/pre-departure/document-pack/{pack_id}:validate` |
| 标记准备完成 | 清单项勾选 | PATCH | `/api/v1/international/pre-departure/checklists/{checklist_id}` |
| 发送提醒 | 右侧按钮 | POST | `/api/v1/international/pre-departure/preparation-cases/{case_id}:send-reminder` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/international/pre-departure/preparation-cases/{case_id}/chat` |

## 3. 核心资源模型

- `preparation_cases`: 行前主案例
- `checklists`: 准备清单，含证件、保险、住宿、随身文件等项
- `document_pack`: 文件包，含签证、录取信、保险等材料

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/international/pre-departure/page-data` | 首屏聚合：案例统计、风险提示、快捷动作 |
| GET | `/api/v1/international/pre-departure/preparation-cases` | 行前案例列表 |
| POST | `/api/v1/international/pre-departure/preparation-cases` | 创建行前案例 |
| GET | `/api/v1/international/pre-departure/preparation-cases/{case_id}` | 行前详情 |
| PATCH | `/api/v1/international/pre-departure/preparation-cases/{case_id}` | 更新阶段、出发日期 |
| GET | `/api/v1/international/pre-departure/checklists` | 清单列表 |
| POST | `/api/v1/international/pre-departure/checklists` | 创建清单 |
| PATCH | `/api/v1/international/pre-departure/checklists/{checklist_id}` | 更新清单项状态 |
| POST | `/api/v1/international/pre-departure/document-pack` | 新建文件包 |
| POST | `/api/v1/international/pre-departure/document-pack/{pack_id}:validate` | 校验文件包 |
| POST | `/api/v1/international/pre-departure/preparation-cases/{case_id}:send-reminder` | 发送提醒 |
| GET | `/api/v1/international/pre-departure/preparation-cases/{case_id}/messages` | 对话历史 |
| POST | `/api/v1/international/pre-departure/preparation-cases/{case_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "student_name": "李思雨",
  "program_id": "program_021",
  "departure_date": "2026-08-28",
  "destination_country": "Finland"
}
```

```json
{
  "id": "pre_001",
  "student_name": "李思雨",
  "status": "preparing",
  "checklist_completion_rate": 0.42,
  "document_pack_status": "pending"
}
```

## 6. SSE 对话流

- `POST /api/v1/international/pre-departure/preparation-cases/{case_id}/chat`
- `context` 建议包含：`pack_id`、`missing_item_ids`、`destination_country`
- 场景：解释签证材料、生成打包建议、识别风险项

## 7. 状态枚举与筛选条件

- `preparation_cases.status`: `draft` | `preparing` | `ready` | `departed` | `archived`
- `checklists.status`: `todo` | `doing` | `done` | `blocked`
- `document_pack.status`: `pending` | `validated` | `need_fix`
- 筛选：
  - `keyword`
  - `status`
  - `destination_country`
  - `departure_from`
  - `departure_to`

## 8. 错误与权限说明

- `403`：非学生本人或管理员不可查看行前文件包
- `409`：已出发案例不可再重置为准备中
- `422`：文件包缺少关键签证材料时校验失败
