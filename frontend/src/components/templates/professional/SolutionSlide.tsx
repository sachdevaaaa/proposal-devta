import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface SolutionSlideProps {
  solutions: string[];
  pageNumber: number;
}

const SolutionSlide: React.FC<SolutionSlideProps> = ({ solutions, pageNumber }) => {
  return (
    <SlideWrapper slideTitle="Proposed Solution" pageNumber={pageNumber}>
      <div className="space-y-4">
        {solutions.map((solution, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="ml-4 text-lg text-gray-700">{solution}</p>
          </div>
        ))}
      </div>
    </SlideWrapper>
  );
};

export default SolutionSlide;