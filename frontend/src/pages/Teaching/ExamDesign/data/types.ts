import type React from "react";

export type DifficultyValue = {
  easy: number;
  medium: number;
  hard: number;
};

export type DifficultyPickerType = React.FC<{
  value: DifficultyValue | undefined;
  onChange: (v: DifficultyValue) => void;
}>;
