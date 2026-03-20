# 助研 - 论文精读接口

## 1. 功能目标

围绕“论文导入 + 结构化拆解 + 批注与证据卡 + 复现清单 + 向写作回填”设计接口，支撑精读工作区对贡献、方法、实验与复现的拆分沉淀。

## 2. 页面动作映射

| 页面动作 | 触发位置 | 方法 | 路径 |
| --- | --- | --- | --- |
| 加载精读 landing 页 | landing 页加载 | GET | `/api/v1/research/paper-reader/page-data` |
| 导入论文 | 列表页主按钮 | POST | `/api/v1/research/paper-reader/papers` |
| 打开精读详情 | 记录卡主按钮 | GET | `/api/v1/research/paper-reader/papers/{paper_id}` |
| 新增阅读笔记 | 详情页笔记区 | POST | `/api/v1/research/paper-reader/reading-notes` |
| 保存证据卡 | 右侧证据卡面板 | POST | `/api/v1/research/paper-reader/evidence-cards` |
| 添加批注 | PDF/段落工具条 | POST | `/api/v1/research/paper-reader/annotations` |
| 生成复现清单 | 快捷动作按钮 | POST | `/api/v1/research/paper-reader/papers/{paper_id}:generate-reproduction-checklist` |
| 回填到写作 | 资源跳转按钮 | POST | `/api/v1/research/paper-reader/evidence-cards:handoff-to-writing` |
| 继续 AI 对话 | `ChatDialog` 发送 | POST | `/api/v1/research/paper-reader/papers/{paper_id}/chat` |

## 3. 核心资源模型

- `papers`: 精读主实体，包含论文元数据、阅读阶段、摘要
- `reading_notes`: 结构化阅读笔记，按问题、贡献、方法、实验拆段
- `evidence_cards`: 可复用论据卡，供写作模块引用
- `annotations`: 片段批注，绑定段落或页码

## 4. 接口列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/research/paper-reader/page-data` | 首屏聚合：最近精读、阶段统计、快捷动作 |
| GET | `/api/v1/research/paper-reader/papers` | 论文列表 |
| POST | `/api/v1/research/paper-reader/papers` | 导入论文 |
| GET | `/api/v1/research/paper-reader/papers/{paper_id}` | 论文详情 |
| PATCH | `/api/v1/research/paper-reader/papers/{paper_id}` | 更新标题、标签、阶段 |
| DELETE | `/api/v1/research/paper-reader/papers/{paper_id}` | 删除论文 |
| GET | `/api/v1/research/paper-reader/reading-notes` | 笔记列表 |
| POST | `/api/v1/research/paper-reader/reading-notes` | 新增阅读笔记 |
| PATCH | `/api/v1/research/paper-reader/reading-notes/{note_id}` | 更新笔记 |
| POST | `/api/v1/research/paper-reader/evidence-cards` | 新增证据卡 |
| PATCH | `/api/v1/research/paper-reader/evidence-cards/{card_id}` | 更新证据卡 |
| POST | `/api/v1/research/paper-reader/annotations` | 新增批注 |
| POST | `/api/v1/research/paper-reader/papers/{paper_id}:generate-reproduction-checklist` | 生成复现清单 |
| POST | `/api/v1/research/paper-reader/evidence-cards:handoff-to-writing` | 批量回填写作 |
| GET | `/api/v1/research/paper-reader/papers/{paper_id}/messages` | 对话历史 |
| POST | `/api/v1/research/paper-reader/papers/{paper_id}/chat` | SSE 对话 |

## 5. 请求响应示例

```json
{
  "title": "Interactive Agents for Research Workflows",
  "source": "CHI 2025",
  "pdf_url": "https://example.org/paper.pdf",
  "tags": ["agent", "workflow", "hci"]
}
```

```json
{
  "id": "paper_001",
  "title": "Interactive Agents for Research Workflows",
  "status": "reading",
  "tag_count": 3,
  "annotation_count": 0
}
```

## 6. SSE 对话流

- `POST /api/v1/research/paper-reader/papers/{paper_id}/chat`
- `context` 建议包含：`selected_annotation_ids`、`note_ids`、`section`
- 场景：解释方法细节、总结贡献、比较基线、生成复现清单

## 7. 状态枚举与筛选条件

- `papers.status`: `queued` | `reading` | `distilled` | `handed_off` | `archived`
- `reading_notes.section`: `problem` | `method` | `experiment` | `result` | `discussion`
- `evidence_cards.kind`: `claim` | `method` | `result` | `limitation`
- 筛选：
  - `keyword`
  - `status`
  - `tag`
  - `source`

## 8. 错误与权限说明

- `403`：非项目成员不可查看私有论文笔记
- `409`：已回填写作的证据卡不可重复以相同批次提交
- `422`：无 PDF 元数据或核心段落时不可生成复现清单
