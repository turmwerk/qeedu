const assignmentReviewPanelShellBaseClassName =
  "flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white/[0.88] border-0 shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] backdrop-blur-[40px] backdrop-saturate-[210%] dark:bg-white/[0.28] dark:border dark:border-white/[0.28] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)]";

export const assignmentReviewMainPanelShellClassName =
  `${assignmentReviewPanelShellBaseClassName} rounded-l-xl rounded-r-none dark:border-r-0`;

export const assignmentReviewAssistantPanelShellClassName =
  `${assignmentReviewPanelShellBaseClassName} rounded-r-xl rounded-l-none`;
