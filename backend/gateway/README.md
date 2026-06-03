# 前后端联调、调用 AI 服务

## OAuth 环境变量

GitHub、Google、Microsoft 登录都走 `/api/v1/auth/{provider}`，回调地址需要配置到对应平台：

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/github/callback

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/google/callback

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_CALLBACK_URL=https://api.qeedu.tech/api/v1/auth/microsoft/callback
```

Microsoft 应用使用 identity platform v2.0，权限至少包含 `openid`、`email`、`profile`、`User.Read`。
