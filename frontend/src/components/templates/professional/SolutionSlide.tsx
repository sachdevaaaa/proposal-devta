import React from "react";

interface SolutionSlideProps {
  solutions: string[]; // list of solutions
}

const SolutionSlide: React.FC<SolutionSlideProps> = ({ solutions }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white flex flex-col items-center justify-center px-12">
      <h2 className="text-5xl font-bold mb-12 border-b-4 border-yellow-400 pb-4">
        Our Solution
      </h2>
      <ul className="space-y-6 text-2xl max-w-3xl list-decimal list-inside">
        {solutions.map((s, idx) => (
          <li key={idx} className="leading-relaxed">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolutionSlide;
