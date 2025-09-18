import React from "react";

interface USPPoint {
  title: string; // e.g., "Fast Delivery"
  description?: string; // optional extra details
}

interface USPProps {
  points: USPPoint[];
}

const USPSlide: React.FC<USPProps> = ({ points }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
          🌟 Unique Selling Points
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="bg-purple-50 border-l-4 border-purple-500 rounded-xl shadow-md p-6 flex flex-col gap-2 transition-transform hover:scale-105 hover:shadow-xl"
            >
              <span className="text-purple-600 text-2xl font-bold">✔️</span>
              <p className="text-gray-800 font-semibold">{point.title}</p>
              {point.description && (
                <p className="text-gray-600 text-sm">{point.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default USPSlide;
