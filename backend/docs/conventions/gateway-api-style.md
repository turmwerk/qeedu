# Gateway API 风格约定

## 1. 基础路径

- 所有业务接口挂在 `/api/v1`
- 健康检查继续使用现有 `/health`、`/ready`
- 本文档只约束 gateway 对外 REST 契约，不约束内部 RPC 或服务拆分

## 2. 鉴权

- 默认全部使用 `backend/gateway/internal/middleware/AuthRequired`
- 请求头：

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

- `401` 统一表示未登录、Token 缺失或 Token 非法

## 3. URL 与命名

- URL 一律使用短横线命名：`/assignment-review`、`/process-flow`
- 主资源使用复数名词：`assignments`、`announcements`、`queries`
- 子资源优先放在主资源路径下：`/assignments/{id}/submissions`
- 非 CRUD 动作用冒号风格补充语义：
  - `POST /feedback-drafts/{id}:publish`
  - `POST /compare-batches/{id}:refresh`
  - `POST /document-pack/{id}:validate`
- 首屏聚合接口统一：
  - `GET /api/v1/{domain}/{feature}/page-data`

## 4. 方法语义

- `GET`：读取资源或首屏聚合数据
- `POST`：创建资源，或触发一次明确的业务动作
- `PATCH`：局部更新资源
- `DELETE`：删除资源

## 5. 返回约定

- 成功：直接返回业务 JSON
- 失败：统一返回

```json
{
  "error": "invalid filter: status"
}
```

- 推荐状态码：
  - `400` 请求体或查询参数非法
  - `401` 未登录或 Token 无效
  - `403` 已登录但无权限访问当前资源
  - `404` 资源不存在
  - `409` 状态冲突，如重复发布、重复归档、重复关闭
  - `422` 业务校验失败，如缺少必填字段、流程前置条件未满足
  - `500` 服务内部异常

## 6. 列表分页与筛选

- 列表接口统一支持：
  - `page`
  - `page_size`
  - `keyword`
  - `status`
- 按业务需要追加：
  - `owner_id`
  - `channel`
  - `priority`
  - `tag`
  - `updated_from`
  - `updated_to`
- 分页返回推荐结构：

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "page_size": 20
}
```

## 7. 字段风格

- JSON 字段统一 `snake_case`
- ID 统一字符串，便于兼容 UUID/雪花 ID
- 时间字段统一 RFC3339 字符串：
  - `created_at`
  - `updated_at`
  - `due_at`
  - `published_at`

## 8. SSE 约定

- 功能级对话接口统一使用 `POST`
- `Content-Type: application/json`
- 响应头与现有 `/api/v1/ai/chat` 保持一致：
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`
  - `X-Accel-Buffering: no`
- 事件语义保持兼容：

```text
data: 第一段增量

data: 第二段增量

data: [DONE]
```

- 失败时：

```text
data: [ERROR] invalid rubric
```

## 9. 推荐请求示例

```http
POST /api/v1/management/announcement-generator/announcements
Authorization: Bearer <jwt>
Content-Type: application/json
```

```json
{
  "title": "2026 春季交换项目报名通知",
  "channel_codes": ["email", "wechat"],
  "audience": "本科生",
  "deadline_at": "2026-04-12T23:59:00+08:00"
}
```

## 10. 落地建议

- Gin Handler 文件命名建议与功能路径一一对应
- `page-data` 只返回首屏必要数据，不承载全部明细
- 大列表与详情编辑仍走独立资源接口
- 功能级 `chat` 接口必须带业务上下文，不能只把前端消息数组原样透传
