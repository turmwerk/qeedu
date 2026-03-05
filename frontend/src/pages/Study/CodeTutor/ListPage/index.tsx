import React from "react";
import TutorialSection from "./components/TutorialSection";
import ProjectList from "./components/ProjectList";
import ResourceSection from "./components/ResourceSection";

const CodeTutorListPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      {/* TutorialSection and ResourceSection are full-width ModuleHub pages */}
      <TutorialSection />

      {/* ProjectList stays in the original constrained layout */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <ProjectList />
      </div>

      <ResourceSection />
    </div>
  );
};

export default CodeTutorListPage;
