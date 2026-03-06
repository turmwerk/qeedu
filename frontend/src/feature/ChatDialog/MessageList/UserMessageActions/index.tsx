import React from "react";
import MessageActions, { type MessageActionsProps } from "../MessageActions";

type UserMessageActionsProps = Omit<
  MessageActionsProps,
  | "editButtonColor"
  | "editButtonHoverBg"
  | "editButtonHoverShadow"
  | "retryButtonColor"
  | "retryButtonHoverBg"
  | "retryButtonHoverShadow"
  | "menuButtonColor"
  | "menuButtonHoverBg"
  | "menuButtonHoverShadow"
>;

const UserMessageActions: React.FC<UserMessageActionsProps> = (props) => {
  return (
    <MessageActions
      {...props}
      editButtonColor="#f97316"
      editButtonHoverBg="#fff7ed"
      editButtonHoverShadow="0_6px_14px_rgba(249,115,22,0.18)"
      retryButtonColor="#10b981"
      retryButtonHoverBg="#ecfdf5"
      retryButtonHoverShadow="0_6px_14px_rgba(16,185,129,0.18)"
      menuButtonColor="#0ea5e9"
      menuButtonHoverBg="#e0f2fe"
      menuButtonHoverShadow="0_6px_14px_rgba(14,165,233,0.18)"
    />
  );
};

export default UserMessageActions;
