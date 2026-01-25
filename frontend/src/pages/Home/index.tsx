import React, { useRef } from "react";
import Introduction from "./components/Introduction";
import FeatureHub from "./components/FeatureHub";

const Home: React.FC = () => {
  const featureHubRef = useRef<HTMLDivElement>(null);

  const handleScrollToFeatureHub = () => {
    if (featureHubRef.current) {
      featureHubRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      <Introduction onScrollToNext={handleScrollToFeatureHub} />
      <div ref={featureHubRef}>
        <FeatureHub />
      </div>
    </div>
  );
};

export default Home;
