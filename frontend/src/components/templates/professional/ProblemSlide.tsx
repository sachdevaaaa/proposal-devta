import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface ProblemSlideProps {
  problems: string[];
  pageNumber: number;
}

const ProblemSlide: React.FC<ProblemSlideProps> = ({ problems, pageNumber }) => {
  return (
    <SlideWrapper slideTitle="Problem Statement" pageNumber={pageNumber}>
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="ml-4 text-lg text-gray-700">{problem}</p>
          </div>
        ))}
      </div>
    </SlideWrapper>
  );
};

export default ProblemSlide;