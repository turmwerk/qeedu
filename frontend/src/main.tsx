import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// 全局样式入口
import "./styles/index.scss";
import { initTheme } from "@/utils/theme/controller";
import { installChunkLoadRecovery } from "@/utils/chunkRecovery";

// Synchronously initialize theme before React mounts to avoid FOUC
initTheme();
installChunkLoadRecovery();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode data-oid="s:g4sh0">
    <App data-oid="ajuzeqx" />
  </React.StrictMode>,
);
