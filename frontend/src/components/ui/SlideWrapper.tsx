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
    // The main container: a white card with a subtle shadow and rounded corners.
    <div className="w-full aspect-video bg-white rounded-lg shadow-xl flex flex-col p-8 md:p-10 font-sans">
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-700">{slideTitle}</h2>
        <h3 className="text-lg font-semibold text-blue-600">{companyName}</h3>
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
  );
};

export default SlideWrapper;

