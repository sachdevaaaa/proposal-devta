import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface USPPoint {
  title: string;
  description?: string;
}

interface USPProps {
  points: USPPoint[];
}

const USPSlide: React.FC<USPProps> = ({ points }) => {
  return (
    <SlideWrapper
      title="🌟 Unique Selling Points"
      subtitle="Why we stand out from the rest"
      bgClass="bg-gradient-to-br from-purple-200 via-purple-100 to-white"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {points.map((point, idx) => (
          <div
            key={idx}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-purple-600 text-3xl font-bold mb-3 block">✔️</span>
            <h3 className="text-xl font-bold text-gray-900">{point.title}</h3>
            {point.description && (
              <p className="text-gray-700 text-sm mt-2">{point.description}</p>
            )}
          </div>
        ))}
      </div>
    </SlideWrapper>
  );
};

export default USPSlide;
