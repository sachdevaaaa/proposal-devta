import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface IntroSlideProps {
  title: string;
  subtitle?: string;
}

const IntroSlide: React.FC<IntroSlideProps> = ({ title, subtitle }) => {
  return (
    <SlideWrapper title={title} subtitle={subtitle}>
      {/* Decorative bar */}
      <div className="mt-8 w-40 h-1 bg-blue-500 rounded-full mx-auto"></div>
    </SlideWrapper>
  );
};

export default IntroSlide;
