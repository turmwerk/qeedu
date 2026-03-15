import React from "react";
import CommonSection from "./Common";
import CsSection from "./CS";
import AIChatSection from "./AIChat";

const ResourceSection: React.FC = () => (
  <section className="w-full min-w-0 overflow-x-hidden">
    <CommonSection />
    <AIChatSection />
    <CsSection />
  </section>
);

export default ResourceSection;
