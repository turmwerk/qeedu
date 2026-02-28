import React from "react";
import { type TabItem } from "../../../../types";

interface ImageViewerProps {
  tab: TabItem;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ tab }) => (
  <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e]">
    <img
      src={tab.id}
      alt={tab.title}
      className="max-h-full max-w-full object-contain"
    />
  </div>
);

export default ImageViewer;
