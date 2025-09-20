import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface USPPoint {
  title: string;
  description?: string;
}

interface USPProps {
  points: USPPoint[];
  pageNumber: number;
}

const USPSlide: React.FC<USPProps> = ({ points, pageNumber }) => {
  return (
    <SlideWrapper slideTitle="Unique Selling Points" pageNumber={pageNumber}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {points.map((point, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.882a.563.563 0 00-.586 0L6.982 21.03a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.562.562 0 00.475-.31L11.48 3.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">{point.title}</h3>
              {point.description && (
                <p className="mt-1 text-base text-gray-600">{point.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SlideWrapper>
  );
};

export default USPSlide;