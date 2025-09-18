import React from "react";

interface IntroSlideProps {
  title: string;
  subtitle?: string;
}

const IntroSlide: React.FC<IntroSlideProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white p-10">
      {/* Title */}
      <h1 className="text-5xl font-bold mb-6 text-center tracking-wide drop-shadow-lg">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <h2 className="text-2xl font-light text-gray-200 max-w-2xl text-center">
          {subtitle}
        </h2>
      )}

      {/* Decorative bar */}
      <div className="mt-10 w-40 h-1 bg-blue-400 rounded-full"></div>
    </div>
  );
};

export default IntroSlide;
