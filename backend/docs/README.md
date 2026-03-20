# 后端接口文档索引

本目录用于沉淀 `gateway` 对外 REST 契约，直接服务前后端联调与后续 Gin Handler 落地。

## 范围

- 基础风格对齐 `backend/gateway/internal/api`
- 路由统一挂在受保护的 `/api/v1`
- 成功返回业务 JSON，失败返回 `{ "error": string }`
- AI 对话沿用现有 `/api/v1/ai/chat` 的 SSE 语义
- 这一轮只覆盖助教、助管、助研、国际交流四个模块里的未完成功能

## 公共约定

- [gateway-api-style.md](./conventions/gateway-api-style.md)
- [common-ai-contracts.md](./conventions/common-ai-contracts.md)

## 助教

- [assignment-review.md](./teaching/assignment-review.md)

## 助管

- [process-assistant.md](./management/process-assistant.md)
- [announcement-generator.md](./management/announcement-generator.md)
- [materials-center.md](./management/materials-center.md)
- [student-qa.md](./management/student-qa.md)
- [dashboard.md](./management/dashboard.md)
- [timeline.md](./management/timeline.md)

## 助研

- [literature-search.md](./research/literature-search.md)
- [paper-reader.md](./research/paper-reader.md)
- [paper-writing.md](./research/paper-writing.md)

## 国际交流

- [exchange-hub.md](./international/exchange-hub.md)
- [matching-lab.md](./international/matching-lab.md)
- [process-flow.md](./international/process-flow.md)
- [writing-desk.md](./international/writing-desk.md)
- [pre-departure.md](./international/pre-departure.md)
- [welcome-portal.md](./international/welcome-portal.md)
- [cultural-training.md](./international/cultural-training.md)
- [abroad-life.md](./international/abroad-life.md)
- [return-service.md](./international/return-service.md)

## 文档编写规则

- 每个功能独立一份文档，不合并成“模块总表”
- 每个功能文档都必须包含：
  - 功能目标
  - 页面动作映射
  - 核心资源模型
  - 接口列表
  - 请求响应示例
  - SSE 对话流
  - 状态枚举与筛选条件
  - 错误与权限说明
- 每个功能都必须定义：
  - `GET /api/v1/{domain}/{feature}/page-data`
  - 至少一个业务主资源集合
  - `GET .../messages`
  - `POST .../chat`
- 前端组织遵循“单页优先”，但接口仍按资源化契约设计；`page-data` 只解决首屏聚合，不替代业务资源接口
- 公共契约优先于内部服务拆分；内部最终是否拆微服务或 gRPC，不在本轮文档中锁定
