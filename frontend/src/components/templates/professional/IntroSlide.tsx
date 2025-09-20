import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface IntroSlideProps {
  title: string;
  subtitle?: string;
  pageNumber: number;
}

const IntroSlide: React.FC<IntroSlideProps> = ({ title, subtitle, pageNumber }) => {
  return (
    <SlideWrapper slideTitle={title} pageNumber={pageNumber}>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </SlideWrapper>
  );
};

export default IntroSlide;