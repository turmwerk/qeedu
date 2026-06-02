export const joinWorkbenchClasses = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const workbenchPanelShellBaseClassName =
  "workbench-panel-shell flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-0 bg-white/[0.88] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] backdrop-blur-[40px] backdrop-saturate-[210%] dark:border dark:border-[rgba(31,196,31,0.20)] dark:bg-black/90 dark:shadow-none";

export const workbenchMainPanelShellClassName = `${workbenchPanelShellBaseClassName} rounded-l-[28px] rounded-r-none dark:border-r-0`;

export const workbenchAssistantPanelShellClassName = `${workbenchPanelShellBaseClassName} rounded-r-[28px] rounded-l-none`;

export const workbenchScrollAreaClassName =
  "flex-1 min-h-0 overflow-y-auto px-5 py-5 md:px-6 md:py-6";
