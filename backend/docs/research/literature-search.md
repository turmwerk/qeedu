# 助研 - 文献检索接口

## 1. 功能目标

围绕“研究问题拆解 + 检索式设计 + 数据库检索 + 样本池筛选 + 向精读移交”设计接口，支撑助研 landing 页与后续工作台的连续流转。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载检索 landing 页 | landing 页加载 | GET | `/api/v1/research/literature-search/page-data` |
| 新建检索任务 | landing CTA / 列表页主按钮 | POST | `/api/v1/research/literature-search/queries` |
| 运行检索 | 查询编辑区按钮 | POST | `/api/v1/research/literature-search/queries/{query_id}:run` |
| 查看结果集 | 结果卡点击 | GET | `/api/v1/research/literature-search/result-sets/{result_set_id}` |
| 保存高价值论文 | 结果项按钮 | POST | `/api/v1/research/literature-search/saved-papers` |
| 记录筛选结论 | 初筛/精筛动作 | POST | `/api/v1/research/literature-search/screening-notes` |
| 刷新主题簇 | 工作台侧栏按钮 | POST | `/api/v1/research/literature-search/result-sets/{result_set_id}:cluster` |
| 移交到精读 | 资源跳转按钮 | POST | `/api/v1/research/literature-search/saved-papers:handoff-to-reader` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/research/literature-search/queries/{query_id}/chat` |

## 3. 核心资源模型

- `queries`: 检索任务，包含研究问题、数据库、检索式、过滤条件
- `result_sets`: 每次运行产生的结果集，包含样本总量、命中库、主题簇摘要
- `saved_papers`: 经筛选保留的论文
- `screening_notes`: 纳排记录，包含理由、阶段、判断人

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/research/literature-search/page-data` | 首屏聚合：最近检索、筛选进展、快捷动作 |
| GET | `/api/v1/research/literature-search/queries` | 检索任务列表 |
| POST | `/api/v1/research/literature-search/queries` | 创建检索任务 |
| GET | `/api/v1/research/literature-search/queries/{query_id}` | 检索任务详情 |
| PATCH | `/api/v1/research/literature-search/queries/{query_id}` | 更新检索式、数据库、过滤条件 |
| DELETE | `/api/v1/research/literature-search/queries/{query_id}` | 删除检索任务 |
| POST | `/api/v1/research/literature-search/queries/{query_id}:run` | 运行检索 |
| GET | `/api/v1/research/literature-search/result-sets/{result_set_id}` | 结果集详情 |
| POST | `/api/v1/research/literature-search/result-sets/{result_set_id}:cluster` | 生成主题簇 |
| POST | `/api/v1/research/literature-search/saved-papers` | 保存论文 |
| GET | `/api/v1/research/literature-search/saved-papers` | 已保存论文列表 |
| POST | `/api/v1/research/literature-search/screening-notes` | 写入筛选结论 |
| POST | `/api/v1/research/literature-search/saved-papers:handoff-to-reader` | 批量移交精读 |
| GET | `/api/v1/research/literature-search/queries/{query_id}/messages` | 对话历史 |
| POST | `/api/v1/research/literature-search/queries/{query_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "RAG 评测综述检索",
  "research_question": "如何评价 RAG 系统的检索质量与生成质量？",
  "database_codes": ["acm", "ieee", "arxiv"],
  "query_text": "(RAG OR retrieval augmented generation) AND (evaluation OR benchmark)"
}
```

```json
{
  "id": "qry_001",
  "title": "RAG 评测综述检索",
  "status": "draft",
  "database_codes": ["acm", "ieee", "arxiv"],
  "saved_paper_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/research/literature-search/queries/{query_id}/chat`
- `context` 建议包含：`query_text`、`database_codes`、`selected_result_ids`
- 场景：扩展同义词、压缩检索式、解释纳排边界、生成筛选理由

## 7. 状态枚举与筛选条件

- `queries.status`: `draft` | `running` | `screening` | `completed` | `archived`
- `screening_notes.stage`: `title_abstract` | `full_text` | `final_review`
- `saved_papers.status`: `saved` | `handed_off` | `excluded`
- 筛选：
  - `keyword`
  - `status`
  - `database_code`
  - `tag`
  - `updated_from`
  - `updated_to`

## 8. 错误与权限说明

- `403`：非创建人或项目成员不可编辑检索任务
- `409`：结果集仍在运行时不可重复执行聚类
- `422`：研究问题为空或检索式为空时不可运行检索
