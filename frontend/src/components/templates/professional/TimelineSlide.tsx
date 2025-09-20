import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface TimelinePhase {
  phase: string;
  duration: string;
  details: string;
}

interface TimelineSlideProps {
  timeline: TimelinePhase[];
  rawText?: string;
  pageNumber: number;
}

const TimelineSlide: React.FC<TimelineSlideProps> = ({ timeline, rawText, pageNumber }) => {
  return (
    <SlideWrapper slideTitle="Project Timeline" pageNumber={pageNumber}>
      <div className="w-full">
        {timeline && timeline.length > 0 && timeline[0].details !== 'Details to be determined.' ? (
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-200"></div>
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div>
                  <div className="pl-4">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{item.phase} - {item.duration}</p>
                    <p className="mt-1 text-gray-700">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{rawText}</p>
          </div>
        )}
      </div>
    </SlideWrapper>
  );
};

export default TimelineSlide;