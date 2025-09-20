import React from "react";

interface Props {
  children: React.ReactNode;
  slideTitle: string;
  pageNumber: number;
  companyName?: string;
}

const SlideWrapper: React.FC<Props> = ({
  children,
  slideTitle,
  pageNumber,
  companyName = "Proposal Devta",
}) => {
  return (
    // Main container with a subtle background pattern
    <div className="w-full aspect-video bg-white rounded-lg shadow-xl flex flex-col font-sans overflow-hidden relative">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-50" style={{backgroundImage: 'linear-gradient(rgba(200, 200, 200, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 200, 200, 0.5) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
      
      <div className="relative z-10 flex flex-col h-full p-8 md:p-10 bg-white/80 backdrop-blur-sm">
        {/* HEADER SECTION with a blue accent bar */}
        <header className="border-b-2 border-gray-100 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">{slideTitle}</h2>
            <h3 className="text-lg font-semibold text-blue-600">{companyName}</h3>
          </div>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full"></div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow py-6 text-left overflow-auto">
          {children}
        </main>

        {/* FOOTER SECTION */}
        <footer className="mt-auto border-t border-gray-100 pt-3 text-right">
          <p className="text-sm text-gray-400">Page {pageNumber}</p>
        </footer>
      </div>
    </div>
  );
};

export default SlideWrapper;