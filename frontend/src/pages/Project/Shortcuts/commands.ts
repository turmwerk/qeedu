import { useCallback, useMemo, useState } from "react";
import { runCode } from "@/api/sandbox";
import { showToast } from "@/ui/Toast";
import { useWorkspace } from "../context";
import { inferLanguage, isRunnableLanguage } from "../data/languageSupport";
import { ViewType, type FileTreeNode } from "../EditorArea/types";
import { useTerminalSessionStore } from "../TerminalPanel/Views/TerminalView/sessionStore";
import { useTerminalPanelViewStore } from "../TerminalPanel/viewStore";
import { SidebarView } from "../Sidebar/constants";
import { useSidebarView } from "../Sidebar/SidebarViewContext";

const SETTINGS_TAB_ID = "__settings__";

const findNodeByPath = (
  node: FileTreeNode,
  path: string,
): FileTreeNode | null => {
  if (node.path === path) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const match = findNodeByPath(child, path);
    if (match) return match;
  }
  return null;
};

const findFirstFile = (node: FileTreeNode): FileTreeNode | null => {
  if (node.type === "file") return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const file = findFirstFile(child);
    if (file) return file;
  }
  return null;
};

type LocalFileSystemFileHandle = {
  kind: "file";
  name: string;
  getFile: () => Promise<File>;
};

type LocalFileSystemDirectoryHandle = {
  kind: "directory";
  name: string;
  values: () => AsyncIterable<LocalFileSystemHandle>;
};

type LocalFileSystemHandle =
  | LocalFileSystemFileHandle
  | LocalFileSystemDirectoryHandle;

type DirectoryPickerWindow = Window &
  typeof globalThis & {
    showDirectoryPicker?: () => Promise<LocalFileSystemDirectoryHandle>;
  };

const sortTreeChildren = (children: FileTreeNode[]): FileTreeNode[] =>
  [...children].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "directory" ? -1 : 1;
    }
    return left.name.localeCompare(right.name, "zh-CN");
  });

const buildLocalFileTree = async (files: FileList): Promise<FileTreeNode | null> => {
  if (!files || files.length === 0) return null;
  const first = files[0];
  const firstPath = (first as File).webkitRelativePath || first.name;
  const rootName = firstPath.split("/")[0] || "workspace";
  const root: FileTreeNode = {
    id: "/",
    name: rootName,
    path: "/",
    type: "directory",
    children: [],
  };
  const dirMap = new Map<string, FileTreeNode>();
  dirMap.set("/", root);

  const getOrCreateDir = (dirPath: string, name: string, parentPath: string) => {
    const existing = dirMap.get(dirPath);
    if (existing) return existing;
    const node: FileTreeNode = {
      id: dirPath,
      name,
      path: dirPath,
      type: "directory",
      children: [],
    };
    const parent = dirMap.get(parentPath);
    if (parent) {
      parent.children = [...(parent.children ?? []), node];
    }
    dirMap.set(dirPath, node);
    return node;
  };

  for (const file of Array.from(files)) {
    const relPath = (file as File).webkitRelativePath || file.name;
    const parts = relPath.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    const fileName = parts.pop();
    if (!fileName) continue;
    let parentPath = "/";
    parts.forEach((part) => {
      const dirPath = parentPath === "/" ? `/${part}` : `${parentPath}/${part}`;
      getOrCreateDir(dirPath, part, parentPath);
      parentPath = dirPath;
    });
    const filePath = parentPath === "/" ? `/${fileName}` : `${parentPath}/${fileName}`;
    const content = await file.text();
    const fileNode: FileTreeNode = {
      id: filePath,
      name: fileName,
      path: filePath,
      type: "file",
      language: inferLanguage(fileName),
      content,
    };
    const parent = dirMap.get(parentPath);
    if (parent) {
      parent.children = [...(parent.children ?? []), fileNode];
    }
  }

  return {
    ...root,
    children: sortTreeChildren(root.children ?? []),
  };
};

const buildLocalFileTreeFromDirectoryHandle = async (
  directoryHandle: LocalFileSystemDirectoryHandle,
): Promise<FileTreeNode> => {
  const buildChildren = async (
    handle: LocalFileSystemDirectoryHandle,
    parentPath: string,
  ): Promise<FileTreeNode[]> => {
    const children: FileTreeNode[] = [];

    for await (const entry of handle.values()) {
      const path = parentPath === "/" ? `/${entry.name}` : `${parentPath}/${entry.name}`;

      if (entry.kind === "directory") {
        children.push({
          id: path,
          name: entry.name,
          path,
          type: "directory",
          children: await buildChildren(entry, path),
        });
        continue;
      }

      const file = await entry.getFile();
      children.push({
        id: path,
        name: entry.name,
        path,
        type: "file",
        language: inferLanguage(entry.name),
        content: await file.text(),
      });
    }

    return sortTreeChildren(children);
  };

  return {
    id: "/",
    name: directoryHandle.name || "workspace",
    path: "/",
    type: "directory",
    children: await buildChildren(directoryHandle, "/"),
  };
};

export const PROJECT_COMMAND_IDS = [
  "app.openSettings",
  "app.openHelp",
  "file.newTextFile",
  "file.newFile",
  "file.newWindow",
  "file.newWindowWithProfile",
  "file.openFile",
  "file.openFolder",
  "file.openWorkspace",
  "file.openRecent",
  "file.addFolderToWorkspace",
  "file.saveWorkspaceAs",
  "file.duplicateWorkspace",
  "file.save",
  "file.saveAs",
  "file.saveAll",
  "file.share",
  "file.autoSave",
  "file.preferences",
  "file.revertFile",
  "edit.undo",
  "edit.redo",
  "edit.cut",
  "edit.copy",
  "edit.paste",
  "edit.find",
  "edit.replace",
  "edit.findInFiles",
  "edit.replaceInFiles",
  "edit.toggleLineComment",
  "edit.toggleBlockComment",
  "edit.emmetExpand",
  "selection.selectAll",
  "selection.expandSelection",
  "selection.shrinkSelection",
  "selection.copyLineUp",
  "selection.copyLineDown",
  "selection.moveLineUp",
  "selection.moveLineDown",
  "selection.duplicateSelection",
  "selection.addCursorAbove",
  "selection.addCursorBelow",
  "selection.addCursorToLineEnd",
  "selection.addNextMatch",
  "selection.addPrevMatch",
  "selection.selectAllMatches",
  "selection.toggleMultiCursorModifier",
  "selection.toggleColumnSelection",
  "view.commandPalette",
  "view.openView",
  "view.appearance",
  "view.editorLayout",
  "view.explorer",
  "view.search",
  "view.sourceControl",
  "view.run",
  "view.extensions",
  "view.chat",
  "view.problems",
  "view.output",
  "view.debugConsole",
  "view.terminal",
  "view.toggleWordWrap",
  "go.back",
  "go.forward",
  "go.lastEditLocation",
  "go.switchEditor",
  "go.switchGroup",
  "go.gotoFile",
  "go.gotoSymbolInWorkspace",
  "go.gotoSymbolInEditor",
  "go.gotoDefinition",
  "go.gotoDeclaration",
  "go.gotoTypeDefinition",
  "go.gotoImplementation",
  "go.gotoReferences",
  "go.gotoLineColumn",
  "go.gotoBracket",
  "go.nextProblem",
  "go.previousProblem",
  "go.nextChange",
  "go.previousChange",
  "run.startDebugging",
  "run.runWithoutDebugging",
  "run.stopDebugging",
  "run.restartDebugging",
  "run.openConfigurations",
  "run.addConfiguration",
  "run.stepOver",
  "run.stepInto",
  "run.stepOut",
  "run.continue",
  "run.toggleBreakpoint",
  "run.newBreakpoint",
  "run.enableAllBreakpoints",
  "run.disableAllBreakpoints",
  "run.removeAllBreakpoints",
  "run.installAdditionalDebuggers",
  "terminal.newTerminal",
  "terminal.splitTerminal",
  "terminal.runTask",
  "terminal.runBuildTask",
  "terminal.runTestTask",
  "terminal.configureTasks",
  "terminal.terminateTask",
  "terminal.runActiveFile",
  "terminal.runSelectedText",
  "terminal.runRecentCommand",
  "terminal.showRunningTasks",
  "terminal.killTerminal",
  "terminal.killAllTerminals",
  "terminal.clearAllTerminals",
  "terminal.renameTerminal",
  "terminal.selectDefaultProfile",
  "terminal.configureTerminalSettings",
  "terminal.focusNextTerminal",
  "terminal.focusPreviousTerminal",
  "terminal.toggleTerminalPanel",
  "terminal.clearTerminal",
  "help.welcome",
  "help.showAllCommands",
  "help.editorPlayground",
  "help.documentation",
  "help.openWalkthrough",
  "help.releaseNotes",
  "help.accessibility",
  "help.askVscode",
  "help.keyboardShortcuts",
  "help.videoTutorials",
  "help.tipsAndTricks",
  "help.joinYoutube",
  "help.searchFeatureRequests",
  "help.reportIssues",
  "help.viewLicense",
  "help.privacyStatement",
  "help.toggleDevTools",
  "help.openProcessExplorer",
  "help.checkForUpdates",
  "help.about",
] as const;

export type ProjectCommandId = (typeof PROJECT_COMMAND_IDS)[number];

export interface ProjectCommand {
  id: ProjectCommandId;
  label: string;
  shortcut?: string;
  keys?: string[];
  allowInEditor?: boolean;
  handler: () => void;
}

export interface ProjectCommandState {
  hasTabs: boolean;
  hasSavedTabs: boolean;
  hasActiveTab: boolean;
  isRunnable: boolean;
  running: boolean;
  hasRunOutput: boolean;
}

export interface ProjectCommandBundle {
  commands: Record<ProjectCommandId, ProjectCommand>;
  state: ProjectCommandState;
}

export interface ProjectCommandsOptions {
  toggleTerminalPanel?: () => void;
}

export const useProjectCommands = (
  options: ProjectCommandsOptions = {},
): ProjectCommandBundle => {
  const {
    workspaceKey,
    fileTree,
    tabs,
    activeTabId,
    openFileTab,
    saveActiveTab,
    setQuickOpenOpen,
    setRunOutput,
    runOutput,
    addFile,
    addFileWithContent,
    addFolder,
    loadFileTree,
  } = useWorkspace();
  const { toggleView } = useSidebarView();
  const addTerminalSession = useTerminalSessionStore((state) => state.addSession);
  const [running, setRunning] = useState(false);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? null,
    [activeTabId, tabs],
  );
  const hasTabs = tabs.length > 0;
  const hasSavedTabs = tabs.some((tab) => !tab.isDirty);
  const hasActiveTab = !!activeTabId;
  const isRunnable = isRunnableLanguage(activeTab?.language);

  const soon = useCallback(
    (label: string) => () => showToast(`${label} 功能即将开放`),
    [],
  );

  const openSettingsTab = useCallback(() => {
    useWorkspace.setState((state) => {
      const existing = state.tabs.find((tab) => tab.id === SETTINGS_TAB_ID);
      if (existing) {
        return { activeTabId: existing.id };
      }
      return {
        tabs: [
          ...state.tabs,
          { id: SETTINGS_TAB_ID, title: "设置", type: ViewType.SETTINGS },
        ],
        activeTabId: SETTINGS_TAB_ID,
      };
    });
  }, []);

  const openHelpDoc = useCallback(() => {
    const readme = findNodeByPath(fileTree, "/README.md");
    if (readme) {
      openFileTab(readme);
      return;
    }
    const firstFile = findFirstFile(fileTree);
    if (!firstFile) {
      showToast("当前工作区没有可打开的文件");
      return;
    }
    openFileTab(firstFile);
    showToast(`已打开示例文件：${firstFile.name}`);
  }, [fileTree, openFileTab]);

  const saveAllTabs = useCallback(() => {
    useWorkspace.setState((state) => ({
      tabs: state.tabs.map((tab) => ({ ...tab, isDirty: false })),
    }));
  }, []);

  const createTextFile = useCallback(() => {
    const node = addFile("/", "未命名.txt", true);
    if (!node) showToast("无法新建文件");
  }, [addFile]);

  const createFile = useCallback(() => {
    const node = addFile("/", "新建文件", true);
    if (!node) showToast("无法新建文件");
  }, [addFile]);

  const createFolder = useCallback(() => {
    const node = addFolder("/", "新建文件夹");
    if (!node) showToast("无法新建文件夹");
  }, [addFolder]);

  const openLocalFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const content = await file.text();
        const node = addFileWithContent("/", file.name, content, true);
        if (!node) {
          showToast("无法打开文件");
        }
      } catch {
        showToast("读取本地文件失败");
      }
    };
    input.click();
  }, [addFileWithContent]);

  const openLocalFolder = useCallback(() => {
    const openFolderByInput = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.setAttribute("webkitdirectory", "true");
      input.onchange = async () => {
        const files = input.files;
        if (!files || files.length === 0) return;
        try {
          const tree = await buildLocalFileTree(files);
          if (!tree) {
            showToast("无法打开文件夹");
            return;
          }
          loadFileTree(tree);
          showToast(`已打开本地文件夹：${tree.name}`);
        } catch {
          showToast("读取本地文件夹失败");
        }
      };
      input.click();
    };

    const showDirectoryPicker = (window as DirectoryPickerWindow).showDirectoryPicker;
    if (typeof showDirectoryPicker !== "function") {
      openFolderByInput();
      return;
    }

    void (async () => {
      try {
        const directoryHandle = await showDirectoryPicker();
        const tree = await buildLocalFileTreeFromDirectoryHandle(directoryHandle);
        loadFileTree(tree);
        showToast(`已打开本地文件夹：${tree.name}`);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        showToast("读取本地文件夹失败");
      }
    })();
  }, [loadFileTree]);

  const handleRun = useCallback(async () => {
    if (!activeTab || !isRunnable) {
      showToast("当前文件不可运行");
      return;
    }
    if (!activeTab.content || !activeTab.language) {
      showToast("没有可运行的内容");
      return;
    }
    if (running) return;
    useTerminalPanelViewStore.getState().showOutput();
    setRunOutput({
      stdout: "",
      stderr: "",
      exitCode: 0,
      executionMs: 0,
      error: "",
      timestamp: Date.now(),
      status: "running",
      language: activeTab.language,
      filePath: activeTab.id,
      fileName: activeTab.title,
    });
    setRunning(true);
    try {
      const resp = await runCode({
        language: activeTab.language,
        code: activeTab.content,
        timeout_seconds: 15,
        workspace_key: workspaceKey,
      });
      setRunOutput({
        stdout: resp.stdout,
        stderr: resp.stderr,
        exitCode: resp.exit_code,
        executionMs: resp.execution_ms,
        error: resp.error,
        timestamp: Date.now(),
        status: "completed",
        language: activeTab.language,
        filePath: activeTab.id,
        fileName: activeTab.title,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "未知错误";
      setRunOutput({
        stdout: "",
        stderr: "",
        exitCode: -1,
        executionMs: 0,
        error: message,
        timestamp: Date.now(),
        status: "completed",
        language: activeTab.language,
        filePath: activeTab.id,
        fileName: activeTab.title,
      });
    } finally {
      setRunning(false);
    }
  }, [activeTab, isRunnable, running, setRunOutput, workspaceKey]);

  const toggleTerminalPanel =
    options.toggleTerminalPanel ?? soon("终端面板");

  const commands = useMemo<Record<ProjectCommandId, ProjectCommand>>(
    () => ({
      "app.openSettings": {
        id: "app.openSettings",
        label: "设置",
        handler: openSettingsTab,
      },
      "app.openHelp": {
        id: "app.openHelp",
        label: "帮助",
        handler: openHelpDoc,
      },
      "file.newTextFile": {
        id: "file.newTextFile",
        label: "新建文本文件",
        shortcut: "Ctrl+N",
        keys: ["ctrl+n", "meta+n"],
        allowInEditor: true,
        handler: createTextFile,
      },
      "file.newFile": {
        id: "file.newFile",
        label: "新建文件...",
        shortcut: "Ctrl+Alt+N",
        keys: ["ctrl+alt+n", "meta+alt+n"],
        allowInEditor: true,
        handler: createFile,
      },
      "file.newWindow": {
        id: "file.newWindow",
        label: "新建窗口",
        shortcut: "Ctrl+Shift+N",
        keys: ["ctrl+shift+n", "meta+shift+n"],
        allowInEditor: true,
        handler: soon("新建窗口"),
      },
      "file.newWindowWithProfile": {
        id: "file.newWindowWithProfile",
        label: "使用配置文件新建窗口",
        handler: soon("使用配置文件新建窗口"),
      },
      "file.openFile": {
        id: "file.openFile",
        label: "打开文件...",
        shortcut: "Ctrl+O",
        keys: ["ctrl+o", "meta+o"],
        allowInEditor: true,
        handler: openLocalFile,
      },
      "file.openFolder": {
        id: "file.openFolder",
        label: "打开文件夹...",
        shortcut: "Ctrl+K Ctrl+O",
        keys: ["ctrl+k ctrl+o", "meta+k meta+o"],
        allowInEditor: true,
        handler: openLocalFolder,
      },
      "file.openWorkspace": {
        id: "file.openWorkspace",
        label: "从文件打开工作区...",
        handler: soon("打开工作区"),
      },
      "file.openRecent": {
        id: "file.openRecent",
        label: "打开最近的文件",
        handler: soon("打开最近的文件"),
      },
      "file.addFolderToWorkspace": {
        id: "file.addFolderToWorkspace",
        label: "将文件夹添加到工作区...",
        handler: createFolder,
      },
      "file.saveWorkspaceAs": {
        id: "file.saveWorkspaceAs",
        label: "将工作区另存为...",
        handler: soon("将工作区另存为"),
      },
      "file.duplicateWorkspace": {
        id: "file.duplicateWorkspace",
        label: "复制工作区",
        handler: soon("复制工作区"),
      },
      "file.save": {
        id: "file.save",
        label: "保存",
        shortcut: "Ctrl+S",
        keys: ["ctrl+s", "meta+s"],
        allowInEditor: true,
        handler: saveActiveTab,
      },
      "file.saveAs": {
        id: "file.saveAs",
        label: "另存为...",
        shortcut: "Ctrl+Shift+S",
        keys: ["ctrl+shift+s", "meta+shift+s"],
        allowInEditor: true,
        handler: soon("另存为"),
      },
      "file.saveAll": {
        id: "file.saveAll",
        label: "全部保存",
        shortcut: "Ctrl+K S",
        keys: ["ctrl+k ctrl+s", "meta+k meta+s"],
        allowInEditor: true,
        handler: saveAllTabs,
      },
      "file.share": {
        id: "file.share",
        label: "共享",
        handler: soon("共享"),
      },
      "file.autoSave": {
        id: "file.autoSave",
        label: "自动保存",
        handler: soon("自动保存"),
      },
      "file.preferences": {
        id: "file.preferences",
        label: "首选项",
        handler: soon("首选项"),
      },
      "file.revertFile": {
        id: "file.revertFile",
        label: "还原文件",
        handler: soon("还原文件"),
      },
      "edit.undo": {
        id: "edit.undo",
        label: "撤销",
        shortcut: "Ctrl+Z",
        keys: ["ctrl+z", "meta+z"],
        handler: soon("撤销"),
      },
      "edit.redo": {
        id: "edit.redo",
        label: "恢复",
        shortcut: "Ctrl+Y",
        keys: ["ctrl+y", "meta+shift+z"],
        handler: soon("恢复"),
      },
      "edit.cut": {
        id: "edit.cut",
        label: "剪切",
        shortcut: "Ctrl+X",
        keys: ["ctrl+x", "meta+x"],
        handler: soon("剪切"),
      },
      "edit.copy": {
        id: "edit.copy",
        label: "复制",
        shortcut: "Ctrl+C",
        keys: ["ctrl+c", "meta+c"],
        handler: soon("复制"),
      },
      "edit.paste": {
        id: "edit.paste",
        label: "粘贴",
        shortcut: "Ctrl+V",
        keys: ["ctrl+v", "meta+v"],
        handler: soon("粘贴"),
      },
      "edit.find": {
        id: "edit.find",
        label: "查找",
        shortcut: "Ctrl+F",
        keys: ["ctrl+f", "meta+f"],
        handler: soon("查找"),
      },
      "edit.replace": {
        id: "edit.replace",
        label: "替换",
        shortcut: "Ctrl+H",
        keys: ["ctrl+h", "meta+alt+f"],
        handler: soon("替换"),
      },
      "edit.findInFiles": {
        id: "edit.findInFiles",
        label: "在文件中查找",
        shortcut: "Ctrl+Shift+F",
        keys: ["ctrl+shift+f", "meta+shift+f"],
        allowInEditor: true,
        handler: () => toggleView(SidebarView.SEARCH),
      },
      "edit.replaceInFiles": {
        id: "edit.replaceInFiles",
        label: "在文件中替换",
        shortcut: "Ctrl+Shift+H",
        keys: ["ctrl+shift+h", "meta+shift+h"],
        allowInEditor: true,
        handler: soon("在文件中替换"),
      },
      "edit.toggleLineComment": {
        id: "edit.toggleLineComment",
        label: "切换行注释",
        shortcut: "Ctrl+/",
        keys: ["ctrl+/", "meta+/"],
        handler: soon("切换行注释"),
      },
      "edit.toggleBlockComment": {
        id: "edit.toggleBlockComment",
        label: "切换块注释",
        shortcut: "Shift+Alt+A",
        keys: ["shift+alt+a"],
        handler: soon("切换块注释"),
      },
      "edit.emmetExpand": {
        id: "edit.emmetExpand",
        label: "Emmet: 展开缩写",
        shortcut: "Tab",
        handler: soon("Emmet 展开缩写"),
      },
      "selection.selectAll": {
        id: "selection.selectAll",
        label: "全选",
        shortcut: "Ctrl+A",
        keys: ["ctrl+a", "meta+a"],
        handler: soon("全选"),
      },
      "selection.expandSelection": {
        id: "selection.expandSelection",
        label: "扩大选区",
        shortcut: "Shift+Alt+RightArrow",
        keys: ["shift+alt+arrowright"],
        handler: soon("扩大选区"),
      },
      "selection.shrinkSelection": {
        id: "selection.shrinkSelection",
        label: "缩小选区",
        shortcut: "Shift+Alt+LeftArrow",
        keys: ["shift+alt+arrowleft"],
        handler: soon("缩小选区"),
      },
      "selection.copyLineUp": {
        id: "selection.copyLineUp",
        label: "向上复制一行",
        shortcut: "Shift+Alt+UpArrow",
        keys: ["shift+alt+arrowup"],
        handler: soon("向上复制一行"),
      },
      "selection.copyLineDown": {
        id: "selection.copyLineDown",
        label: "向下复制一行",
        shortcut: "Shift+Alt+DownArrow",
        keys: ["shift+alt+arrowdown"],
        handler: soon("向下复制一行"),
      },
      "selection.moveLineUp": {
        id: "selection.moveLineUp",
        label: "向上移动一行",
        shortcut: "Alt+UpArrow",
        keys: ["alt+arrowup"],
        handler: soon("向上移动一行"),
      },
      "selection.moveLineDown": {
        id: "selection.moveLineDown",
        label: "向下移动一行",
        shortcut: "Alt+DownArrow",
        keys: ["alt+arrowdown"],
        handler: soon("向下移动一行"),
      },
      "selection.duplicateSelection": {
        id: "selection.duplicateSelection",
        label: "重复选择",
        handler: soon("重复选择"),
      },
      "selection.addCursorAbove": {
        id: "selection.addCursorAbove",
        label: "在上面添加光标",
        shortcut: "Ctrl+Alt+UpArrow",
        keys: ["ctrl+alt+arrowup", "meta+alt+arrowup"],
        handler: soon("添加光标"),
      },
      "selection.addCursorBelow": {
        id: "selection.addCursorBelow",
        label: "在下面添加光标",
        shortcut: "Ctrl+Alt+DownArrow",
        keys: ["ctrl+alt+arrowdown", "meta+alt+arrowdown"],
        handler: soon("添加光标"),
      },
      "selection.addCursorToLineEnd": {
        id: "selection.addCursorToLineEnd",
        label: "在行尾添加光标",
        shortcut: "Shift+Alt+I",
        keys: ["shift+alt+i"],
        handler: soon("在行尾添加光标"),
      },
      "selection.addNextMatch": {
        id: "selection.addNextMatch",
        label: "添加下一个匹配项",
        shortcut: "Ctrl+D",
        keys: ["ctrl+d", "meta+d"],
        handler: soon("添加下一个匹配项"),
      },
      "selection.addPrevMatch": {
        id: "selection.addPrevMatch",
        label: "添加上一个匹配项",
        shortcut: "Ctrl+K Ctrl+D",
        keys: ["ctrl+k ctrl+d", "meta+k meta+d"],
        handler: soon("添加上一个匹配项"),
      },
      "selection.selectAllMatches": {
        id: "selection.selectAllMatches",
        label: "选择所有匹配项",
        handler: soon("选择所有匹配项"),
      },
      "selection.toggleMultiCursorModifier": {
        id: "selection.toggleMultiCursorModifier",
        label: "切换为\"Ctrl+单击\"进行多光标功能",
        handler: soon("切换多光标"),
      },
      "selection.toggleColumnSelection": {
        id: "selection.toggleColumnSelection",
        label: "列选择模式",
        handler: soon("列选择模式"),
      },
      "view.commandPalette": {
        id: "view.commandPalette",
        label: "命令面板...",
        shortcut: "Ctrl+Shift+P",
        keys: ["ctrl+shift+p", "meta+shift+p"],
        allowInEditor: true,
        handler: soon("命令面板"),
      },
      "view.openView": {
        id: "view.openView",
        label: "打开视图...",
        handler: soon("打开视图"),
      },
      "view.appearance": {
        id: "view.appearance",
        label: "外观",
        handler: soon("外观"),
      },
      "view.editorLayout": {
        id: "view.editorLayout",
        label: "编辑器布局",
        handler: soon("编辑器布局"),
      },
      "view.explorer": {
        id: "view.explorer",
        label: "资源管理器",
        shortcut: "Ctrl+Shift+E",
        keys: ["ctrl+shift+e", "meta+shift+e"],
        allowInEditor: true,
        handler: () => toggleView(SidebarView.EXPLORER),
      },
      "view.search": {
        id: "view.search",
        label: "搜索",
        shortcut: "Ctrl+Shift+F",
        keys: ["ctrl+shift+f", "meta+shift+f"],
        allowInEditor: true,
        handler: () => toggleView(SidebarView.SEARCH),
      },
      "view.sourceControl": {
        id: "view.sourceControl",
        label: "源代码管理",
        shortcut: "Ctrl+Shift+G",
        keys: ["ctrl+shift+g", "meta+shift+g"],
        allowInEditor: true,
        handler: () => toggleView(SidebarView.SCM),
      },
      "view.run": {
        id: "view.run",
        label: "运行",
        shortcut: "Ctrl+Shift+D",
        keys: ["ctrl+shift+d", "meta+shift+d"],
        allowInEditor: true,
        handler: soon("运行"),
      },
      "view.extensions": {
        id: "view.extensions",
        label: "扩展",
        shortcut: "Ctrl+Shift+X",
        keys: ["ctrl+shift+x", "meta+shift+x"],
        allowInEditor: true,
        handler: () => toggleView(SidebarView.EXTENSIONS),
      },
      "view.chat": {
        id: "view.chat",
        label: "聊天",
        shortcut: "Ctrl+Alt+I",
        keys: ["ctrl+alt+i", "meta+alt+i"],
        allowInEditor: true,
        handler: soon("聊天"),
      },
      "view.problems": {
        id: "view.problems",
        label: "问题",
        shortcut: "Ctrl+Shift+M",
        keys: ["ctrl+shift+m", "meta+shift+m"],
        allowInEditor: true,
        handler: soon("问题"),
      },
      "view.output": {
        id: "view.output",
        label: "输出",
        shortcut: "Ctrl+Shift+U",
        keys: ["ctrl+shift+u", "meta+shift+u"],
        allowInEditor: true,
        handler: soon("输出"),
      },
      "view.debugConsole": {
        id: "view.debugConsole",
        label: "调试控制台",
        shortcut: "Ctrl+Shift+Y",
        keys: ["ctrl+shift+y", "meta+shift+y"],
        allowInEditor: true,
        handler: soon("调试控制台"),
      },
      "view.terminal": {
        id: "view.terminal",
        label: "终端",
        shortcut: "Ctrl+`",
        keys: ["ctrl+`", "meta+`"],
        allowInEditor: true,
        handler: toggleTerminalPanel,
      },
      "view.toggleWordWrap": {
        id: "view.toggleWordWrap",
        label: "自动换行",
        shortcut: "Alt+Z",
        keys: ["alt+z"],
        handler: soon("自动换行"),
      },
      "go.back": {
        id: "go.back",
        label: "返回",
        shortcut: "Alt+LeftArrow",
        keys: ["alt+arrowleft"],
        allowInEditor: true,
        handler: soon("返回"),
      },
      "go.forward": {
        id: "go.forward",
        label: "前进",
        shortcut: "Alt+RightArrow",
        keys: ["alt+arrowright"],
        allowInEditor: true,
        handler: soon("前进"),
      },
      "go.lastEditLocation": {
        id: "go.lastEditLocation",
        label: "上次编辑位置",
        shortcut: "Ctrl+K Ctrl+Q",
        keys: ["ctrl+k ctrl+q", "meta+k meta+q"],
        allowInEditor: true,
        handler: soon("上次编辑位置"),
      },
      "go.switchEditor": {
        id: "go.switchEditor",
        label: "切换编辑器",
        handler: soon("切换编辑器"),
      },
      "go.switchGroup": {
        id: "go.switchGroup",
        label: "切换组",
        handler: soon("切换组"),
      },
      "go.gotoFile": {
        id: "go.gotoFile",
        label: "转到文件...",
        shortcut: "Ctrl+P",
        keys: ["ctrl+p", "meta+p"],
        allowInEditor: true,
        handler: () => setQuickOpenOpen(true),
      },
      "go.gotoSymbolInWorkspace": {
        id: "go.gotoSymbolInWorkspace",
        label: "转到工作区中的符号...",
        shortcut: "Ctrl+T",
        keys: ["ctrl+t", "meta+t"],
        allowInEditor: true,
        handler: soon("转到工作区中的符号"),
      },
      "go.gotoSymbolInEditor": {
        id: "go.gotoSymbolInEditor",
        label: "转到编辑器中的符号...",
        shortcut: "Ctrl+Shift+O",
        keys: ["ctrl+shift+o", "meta+shift+o"],
        allowInEditor: true,
        handler: soon("转到编辑器中的符号"),
      },
      "go.gotoDefinition": {
        id: "go.gotoDefinition",
        label: "转到定义",
        shortcut: "F12",
        keys: ["f12"],
        allowInEditor: true,
        handler: soon("转到定义"),
      },
      "go.gotoDeclaration": {
        id: "go.gotoDeclaration",
        label: "转到声明",
        handler: soon("转到声明"),
      },
      "go.gotoTypeDefinition": {
        id: "go.gotoTypeDefinition",
        label: "转到类型定义",
        handler: soon("转到类型定义"),
      },
      "go.gotoImplementation": {
        id: "go.gotoImplementation",
        label: "转到实现",
        shortcut: "Ctrl+F12",
        keys: ["ctrl+f12", "meta+f12"],
        allowInEditor: true,
        handler: soon("转到实现"),
      },
      "go.gotoReferences": {
        id: "go.gotoReferences",
        label: "转到引用",
        shortcut: "Shift+F12",
        keys: ["shift+f12"],
        allowInEditor: true,
        handler: soon("转到引用"),
      },
      "go.gotoLineColumn": {
        id: "go.gotoLineColumn",
        label: "转到行/列...",
        shortcut: "Ctrl+G",
        keys: ["ctrl+g", "meta+g"],
        allowInEditor: true,
        handler: soon("转到行/列"),
      },
      "go.gotoBracket": {
        id: "go.gotoBracket",
        label: "转到括号",
        shortcut: "Ctrl+Shift+\\",
        keys: ["ctrl+shift+\\", "meta+shift+\\"],
        allowInEditor: true,
        handler: soon("转到括号"),
      },
      "go.nextProblem": {
        id: "go.nextProblem",
        label: "下一个问题",
        shortcut: "F8",
        keys: ["f8"],
        allowInEditor: true,
        handler: soon("下一个问题"),
      },
      "go.previousProblem": {
        id: "go.previousProblem",
        label: "上一个问题",
        shortcut: "Shift+F8",
        keys: ["shift+f8"],
        allowInEditor: true,
        handler: soon("上一个问题"),
      },
      "go.nextChange": {
        id: "go.nextChange",
        label: "下一个更改",
        shortcut: "Alt+F3",
        keys: ["alt+f3"],
        allowInEditor: true,
        handler: soon("下一个更改"),
      },
      "go.previousChange": {
        id: "go.previousChange",
        label: "上一个更改",
        shortcut: "Shift+Alt+F3",
        keys: ["shift+alt+f3"],
        allowInEditor: true,
        handler: soon("上一个更改"),
      },
      "run.startDebugging": {
        id: "run.startDebugging",
        label: "启动调试",
        handler: soon("启动调试"),
      },
      "run.runWithoutDebugging": {
        id: "run.runWithoutDebugging",
        label: "以非调试模式运行",
        shortcut: "Ctrl+F5",
        keys: ["ctrl+f5", "meta+f5"],
        allowInEditor: true,
        handler: handleRun,
      },
      "run.stopDebugging": {
        id: "run.stopDebugging",
        label: "停止调试",
        shortcut: "Shift+F5",
        keys: ["shift+f5"],
        allowInEditor: true,
        handler: soon("停止调试"),
      },
      "run.restartDebugging": {
        id: "run.restartDebugging",
        label: "重启调试",
        shortcut: "Ctrl+Shift+F5",
        keys: ["ctrl+shift+f5", "meta+shift+f5"],
        allowInEditor: true,
        handler: soon("重启调试"),
      },
      "run.openConfigurations": {
        id: "run.openConfigurations",
        label: "打开配置",
        handler: soon("打开配置"),
      },
      "run.addConfiguration": {
        id: "run.addConfiguration",
        label: "添加配置...",
        handler: soon("添加配置"),
      },
      "run.stepOver": {
        id: "run.stepOver",
        label: "逐过程",
        shortcut: "F10",
        keys: ["f10"],
        allowInEditor: true,
        handler: soon("逐过程"),
      },
      "run.stepInto": {
        id: "run.stepInto",
        label: "单步执行",
        shortcut: "F11",
        keys: ["f11"],
        allowInEditor: true,
        handler: soon("单步执行"),
      },
      "run.stepOut": {
        id: "run.stepOut",
        label: "单步跳出",
        shortcut: "Shift+F11",
        keys: ["shift+f11"],
        allowInEditor: true,
        handler: soon("单步跳出"),
      },
      "run.continue": {
        id: "run.continue",
        label: "继续",
        handler: soon("继续"),
      },
      "run.toggleBreakpoint": {
        id: "run.toggleBreakpoint",
        label: "切换断点",
        shortcut: "F9",
        keys: ["f9"],
        allowInEditor: true,
        handler: soon("切换断点"),
      },
      "run.newBreakpoint": {
        id: "run.newBreakpoint",
        label: "新建断点",
        handler: soon("新建断点"),
      },
      "run.enableAllBreakpoints": {
        id: "run.enableAllBreakpoints",
        label: "启用所有断点",
        handler: soon("启用所有断点"),
      },
      "run.disableAllBreakpoints": {
        id: "run.disableAllBreakpoints",
        label: "禁用所有断点",
        handler: soon("禁用所有断点"),
      },
      "run.removeAllBreakpoints": {
        id: "run.removeAllBreakpoints",
        label: "删除所有断点",
        handler: soon("删除所有断点"),
      },
      "run.installAdditionalDebuggers": {
        id: "run.installAdditionalDebuggers",
        label: "安装附加调试器...",
        handler: soon("安装附加调试器"),
      },
      "terminal.newTerminal": {
        id: "terminal.newTerminal",
        label: "新建终端",
        shortcut: "Ctrl+Shift+`",
        keys: ["ctrl+shift+`", "meta+shift+`"],
        allowInEditor: true,
        handler: () => {
          addTerminalSession();
          showToast("已创建新终端");
        },
      },
      "terminal.splitTerminal": {
        id: "terminal.splitTerminal",
        label: "拆分终端",
        shortcut: "Ctrl+Shift+5",
        keys: ["ctrl+shift+5", "meta+shift+5"],
        allowInEditor: true,
        handler: soon("拆分终端"),
      },
      "terminal.runTask": {
        id: "terminal.runTask",
        label: "运行任务...",
        shortcut: "Ctrl+Shift+B",
        keys: ["ctrl+shift+b", "meta+shift+b"],
        allowInEditor: true,
        handler: soon("运行任务"),
      },
      "terminal.runBuildTask": {
        id: "terminal.runBuildTask",
        label: "运行生成任务...",
        handler: soon("运行生成任务"),
      },
      "terminal.runTestTask": {
        id: "terminal.runTestTask",
        label: "运行测试任务...",
        handler: soon("运行测试任务"),
      },
      "terminal.runActiveFile": {
        id: "terminal.runActiveFile",
        label: "运行活动文件",
        handler: soon("运行活动文件"),
      },
      "terminal.runSelectedText": {
        id: "terminal.runSelectedText",
        label: "在活动终端中运行所选文本",
        handler: soon("运行所选文本"),
      },
      "terminal.runRecentCommand": {
        id: "terminal.runRecentCommand",
        label: "运行最近的命令...",
        handler: soon("运行最近的命令"),
      },
      "terminal.showRunningTasks": {
        id: "terminal.showRunningTasks",
        label: "显示正在运行的任务...",
        handler: soon("显示正在运行的任务"),
      },
      "terminal.configureTasks": {
        id: "terminal.configureTasks",
        label: "配置任务...",
        handler: soon("配置任务"),
      },
      "terminal.terminateTask": {
        id: "terminal.terminateTask",
        label: "终止任务...",
        handler: soon("终止任务"),
      },
      "terminal.killTerminal": {
        id: "terminal.killTerminal",
        label: "终止终端",
        handler: soon("终止终端"),
      },
      "terminal.killAllTerminals": {
        id: "terminal.killAllTerminals",
        label: "终止所有终端",
        handler: soon("终止所有终端"),
      },
      "terminal.toggleTerminalPanel": {
        id: "terminal.toggleTerminalPanel",
        label: "切换终端面板",
        shortcut: "Ctrl+`",
        keys: ["ctrl+`", "meta+`"],
        allowInEditor: true,
        handler: toggleTerminalPanel,
      },
      "terminal.clearTerminal": {
        id: "terminal.clearTerminal",
        label: "清除终端",
        handler: soon("清除终端"),
      },
      "terminal.clearAllTerminals": {
        id: "terminal.clearAllTerminals",
        label: "清除所有终端",
        handler: soon("清除所有终端"),
      },
      "terminal.renameTerminal": {
        id: "terminal.renameTerminal",
        label: "重命名终端",
        handler: soon("重命名终端"),
      },
      "terminal.selectDefaultProfile": {
        id: "terminal.selectDefaultProfile",
        label: "选择默认配置文件...",
        handler: soon("选择默认配置文件"),
      },
      "terminal.configureTerminalSettings": {
        id: "terminal.configureTerminalSettings",
        label: "配置终端设置...",
        handler: soon("配置终端设置"),
      },
      "terminal.focusNextTerminal": {
        id: "terminal.focusNextTerminal",
        label: "聚焦下一个终端",
        handler: soon("聚焦下一个终端"),
      },
      "terminal.focusPreviousTerminal": {
        id: "terminal.focusPreviousTerminal",
        label: "聚焦上一个终端",
        handler: soon("聚焦上一个终端"),
      },
      "help.welcome": {
        id: "help.welcome",
        label: "欢迎",
        handler: soon("欢迎"),
      },
      "help.showAllCommands": {
        id: "help.showAllCommands",
        label: "显示所有命令",
        shortcut: "Ctrl+Shift+P",
        keys: ["ctrl+shift+p", "meta+shift+p"],
        allowInEditor: true,
        handler: soon("显示所有命令"),
      },
      "help.editorPlayground": {
        id: "help.editorPlayground",
        label: "编辑器操场",
        handler: soon("编辑器操场"),
      },
      "help.documentation": {
        id: "help.documentation",
        label: "文档",
        handler: soon("文档"),
      },
      "help.openWalkthrough": {
        id: "help.openWalkthrough",
        label: "打开演练...",
        handler: soon("打开演练"),
      },
      "help.releaseNotes": {
        id: "help.releaseNotes",
        label: "显示发行说明",
        handler: soon("发行说明"),
      },
      "help.accessibility": {
        id: "help.accessibility",
        label: "辅助功能入门",
        handler: soon("辅助功能入门"),
      },
      "help.askVscode": {
        id: "help.askVscode",
        label: "询问 @vscode",
        handler: soon("询问 @vscode"),
      },
      "help.keyboardShortcuts": {
        id: "help.keyboardShortcuts",
        label: "键盘快捷方式参考",
        shortcut: "Ctrl+K Ctrl+R",
        keys: ["ctrl+k ctrl+r", "meta+k meta+r"],
        allowInEditor: true,
        handler: soon("键盘快捷方式参考"),
      },
      "help.videoTutorials": {
        id: "help.videoTutorials",
        label: "视频教程",
        handler: soon("视频教程"),
      },
      "help.tipsAndTricks": {
        id: "help.tipsAndTricks",
        label: "贴士和技巧",
        handler: soon("贴士和技巧"),
      },
      "help.joinYoutube": {
        id: "help.joinYoutube",
        label: "在 YouTube 上加入我们",
        handler: soon("加入 YouTube"),
      },
      "help.searchFeatureRequests": {
        id: "help.searchFeatureRequests",
        label: "搜索功能请求",
        handler: soon("搜索功能请求"),
      },
      "help.reportIssues": {
        id: "help.reportIssues",
        label: "使用英文报告问题",
        handler: soon("报告问题"),
      },
      "help.viewLicense": {
        id: "help.viewLicense",
        label: "查看许可证",
        handler: soon("查看许可证"),
      },
      "help.privacyStatement": {
        id: "help.privacyStatement",
        label: "隐私声明",
        handler: soon("隐私声明"),
      },
      "help.toggleDevTools": {
        id: "help.toggleDevTools",
        label: "切换开发人员工具",
        handler: soon("切换开发人员工具"),
      },
      "help.openProcessExplorer": {
        id: "help.openProcessExplorer",
        label: "打开进程资源管理器",
        handler: soon("打开进程资源管理器"),
      },
      "help.checkForUpdates": {
        id: "help.checkForUpdates",
        label: "检查更新...",
        handler: soon("检查更新"),
      },
      "help.about": {
        id: "help.about",
        label: "关于",
        handler: openHelpDoc,
      },
    }),
    [
      addTerminalSession,
      createFile,
      createFolder,
      createTextFile,
      handleRun,
      openLocalFile,
      openLocalFolder,
      openHelpDoc,
      saveActiveTab,
      saveAllTabs,
      setQuickOpenOpen,
      soon,
      toggleTerminalPanel,
      toggleView,
      openSettingsTab,
    ],
  );

  return {
    commands,
    state: {
      hasTabs,
      hasSavedTabs,
      hasActiveTab,
      isRunnable,
      running,
      hasRunOutput: !!runOutput,
    },
  };
};
