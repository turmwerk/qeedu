import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss'; // 全局样式仍在入口引入

// 核心任务：将 App 组件挂载到 DOM 上
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);