export const CompletionMode = {
	NONE: "none",
	BASIC: "basic",
	ADVANCED: "advanced",
	AI: "ai",
} as const;
export type CompletionMode = (typeof CompletionMode)[keyof typeof CompletionMode];

export const COMPLETION_MODE_LABELS: Record<CompletionMode, string> = {
	[CompletionMode.NONE]: "None",
	[CompletionMode.BASIC]: "Basic",
	[CompletionMode.ADVANCED]: "Advanced",
	[CompletionMode.AI]: "AI",
};
