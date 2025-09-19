import React from "react";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  bgClass?: string; // This line is now added
}

const SlideWrapper: React.FC<Props> = ({ children, title, subtitle, bgClass }) => { // Added bgClass here
  return (
    // This className now correctly uses the bgClass if it's provided
    <div
      className={`w-full aspect-video flex flex-col items-center justify-center p-8 md:p-16 rounded-2xl shadow-xl text-gray-800 ${
        bgClass || "bg-gradient-to-br from-white to-gray-50"
      }`}
    >
      <div className="max-w-5xl w-full text-center">
        {title && (
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-600 mb-10">{subtitle}</p>
        )}
        <div className="text-xl leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default SlideWrapper;