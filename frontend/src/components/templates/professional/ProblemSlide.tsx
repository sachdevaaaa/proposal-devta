import React from "react";

interface ProblemSlideProps {
  problems: string[]; // list of problems to highlight
}

const ProblemSlide: React.FC<ProblemSlideProps> = ({ problems }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center px-12">
      <h2 className="text-5xl font-bold mb-12 border-b-4 border-pink-400 pb-4">
        The Problem
      </h2>
      <ul className="space-y-6 text-2xl max-w-3xl list-disc list-inside">
        {problems.map((p, idx) => (
          <li key={idx} className="leading-relaxed">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemSlide;
