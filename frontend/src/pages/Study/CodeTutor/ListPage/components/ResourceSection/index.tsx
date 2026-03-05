import React from "react";
import CommonSection from "./Common";
import CsSection from "./CS";

const ResourceSection: React.FC = () => (
  <section className="w-full min-w-0 overflow-x-hidden">
    <CommonSection />
    <CsSection />
  </section>
);

export default ResourceSection;
