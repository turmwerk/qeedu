import React from "react";
import AcademicSection from "./AcademicSection";
import AdaptationSection from "./AdaptationSection";
import SafetySection from "./SafetySection";

const ResourceSection: React.FC = () => (
  <section className="w-full min-w-0 overflow-x-hidden">
    <AcademicSection />
    <SafetySection />
    <AdaptationSection />
  </section>
);

export default ResourceSection;
