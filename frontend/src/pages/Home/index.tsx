import React, { useRef } from "react";
import Introduction from "./components/Introduction";
import FeatureHub from "./components/FeatureHub";
import Footer from "@/layouts/MainLayout/components/Footer";

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
