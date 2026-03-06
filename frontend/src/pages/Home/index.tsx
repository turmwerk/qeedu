import React, { useRef } from "react";
import Introduction from "./Introduction";
import FeatureHub from "./FeatureHub";
import Footer from "@/layouts/MainLayout/Footer";

const Home: React.FC = () => {
  const featureHubRef = useRef<HTMLDivElement>(null);

  const handleScrollToFeatureHub = () => {
    if (featureHubRef.current) {
      featureHubRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page-bg w-full">
      <Introduction onScrollToNext={handleScrollToFeatureHub} />
      <div ref={featureHubRef}>
        <FeatureHub />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
