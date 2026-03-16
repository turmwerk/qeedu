export type InlineEditMode = "create-file" | "create-folder" | "rename";

export interface InlineEditState {
  mode: InlineEditMode;
  parentPath?: string;
  targetPath?: string;
  initialName: string;
}
