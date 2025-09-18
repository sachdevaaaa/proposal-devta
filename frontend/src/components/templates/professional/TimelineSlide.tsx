import React from "react";

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
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center px-12">
      <h2 className="text-5xl font-bold text-blue-900 mb-16">Project Timeline</h2>

      <div className="relative w-full max-w-4xl">
        {/* vertical line */}
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
                className={`w-5/12 p-6 rounded-xl shadow-lg ${
                  idx % 2 === 0
                    ? "bg-blue-100 text-blue-900"
                    : "bg-yellow-100 text-yellow-900"
                }`}
              >
                <h3 className="text-2xl font-semibold">{item.phase}</h3>
                <p className="text-sm font-medium italic">{item.duration}</p>
                <p className="mt-2 text-lg">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlide;
