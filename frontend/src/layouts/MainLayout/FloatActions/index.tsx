import React from "react";
import FloatingButton from "@/layouts/MainLayout/FloatingButton";

interface FloatActionsProps {
  scrollContainer?: HTMLElement | null;
}

const FloatActions: React.FC<FloatActionsProps> = ({ scrollContainer }) => (
  <FloatingButton scrollContainer={scrollContainer} />
);

export default FloatActions;
