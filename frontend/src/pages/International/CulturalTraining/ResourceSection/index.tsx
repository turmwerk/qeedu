import React from "react";
import AcademicSection from "./AcademicSection";
import AdaptationSection from "./AdaptationSection";
import SafetySection from "./SafetySection";

const ResourceSection: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">

      <section className="w-full min-w-0 overflow-x-hidden space-y-6">
        <AcademicSection />
        <SafetySection />
        <AdaptationSection />
      </section>
    </div>
  );
};

export default ResourceSection;
