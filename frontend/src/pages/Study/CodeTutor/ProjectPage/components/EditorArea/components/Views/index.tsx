import React from "react";
import { ViewType, type TabItem } from "../../types";
import WelcomePage from "./components/WelcomePage";
import CodeEditorView from "./components/CodeEditor";
import MarkdownViewer from "./components/MarkdownViewer";
import SettingsEditor from "./components/SettingsEditor";
import ImageViewer from "./components/ImageViewer";

interface ViewsProps {
  activeTab: TabItem | null;
}

const Views: React.FC<ViewsProps> = ({ activeTab }) => {
  if (!activeTab) return <WelcomePage />;

  switch (activeTab.type) {
    case ViewType.CODE:
      return <CodeEditorView tab={activeTab} />;
    case ViewType.MARKDOWN:
      return <MarkdownViewer tab={activeTab} />;
    case ViewType.SETTINGS:
      return <SettingsEditor />;
    case ViewType.IMAGE:
      return <ImageViewer tab={activeTab} />;
    default:
      return <WelcomePage />;
  }
};

export default Views;
