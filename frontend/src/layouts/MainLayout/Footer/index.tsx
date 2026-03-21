import React from "react";
import LinksPanel from "./LinksPanel";
import BottomBar from "./BottomBar";

type FooterProps = {
  showLinksPanel?: boolean;
};

const Footer: React.FC<FooterProps> = ({ showLinksPanel = true }) => {
  return (
    <footer className="w-full mt-auto z-10 relative bg-transparent">
      {showLinksPanel && <LinksPanel />}
      <BottomBar />
    </footer>
  );
};

export default Footer;
