import React from "react";
import TutorialSection from "./components/TutorialSection";
import ProjectList from "./components/ProjectList";
import ResourceSection from "./components/ResourceSection";

const CodeTutorListPage: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8">
      

      <TutorialSection />
      <ProjectList />
      <ResourceSection />
    </div>
  );
};

export default CodeTutorListPage;
