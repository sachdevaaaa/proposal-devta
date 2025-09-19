import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface TimelineItem {
  phase: string;
  duration: string;
  details: string;
}

interface TimelineSlideProps {
  timeline: TimelineItem[];
}

const TimelineSlide: React.FC<TimelineSlideProps> = ({ timeline }) => {
  return (
    <SlideWrapper title="Project Timeline">
      <div className="relative w-full max-w-4xl mx-auto py-8">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-blue-500"></div>

        <div className="space-y-12">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center w-full ${
                idx % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`w-5/12 p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 ${
                  idx % 2 === 0
                    ? "bg-blue-50 text-blue-900"
                    : "bg-yellow-50 text-yellow-900"
                }`}
              >
                <h3 className="text-xl font-semibold">{item.phase}</h3>
                <p className="text-sm font-medium italic text-gray-600">{item.duration}</p>
                <p className="mt-2 text-base leading-relaxed">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
};

export default TimelineSlide;
