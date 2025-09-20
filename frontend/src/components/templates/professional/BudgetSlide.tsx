import React from "react";
import SlideWrapper from "../../ui/SlideWrapper";

interface BudgetSlideProps {
  items: { label: string; value: number }[];
  rawText?: string;
  pageNumber: number;
}

// A helper function to provide a relevant icon based on the budget item's label.
const getIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("develop") || lowerLabel.includes("engineer")) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/></svg>;
    if (lowerLabel.includes("market") || lowerLabel.includes("advertis")) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    if (lowerLabel.includes("personnel") || lowerLabel.includes("salar")) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
};

const BudgetSlide: React.FC<BudgetSlideProps> = ({ items, rawText, pageNumber }) => {
  const totalBudget = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <SlideWrapper slideTitle="Investment Overview" pageNumber={pageNumber}>
      <div className="w-full text-left">
        {items && items.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">A transparent breakdown of the projected costs for this initiative. All figures are in INR.</p>
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-t-lg">
                <div className="col-span-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Description</div>
                <div className="col-span-2 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Cost</div>
              </div>
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 p-4 items-center">
                    <div className="col-span-3 flex items-center">
                       <div className="text-blue-600 mr-3">{getIcon(item.label)}</div>
                       <span className="font-medium text-gray-800">{item.label}</span>
                    </div>
                    <div className="col-span-2 text-right font-mono text-gray-700">₹{item.value.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              {/* Table Footer */}
              <div className="grid grid-cols-5 gap-4 p-4 mt-2 bg-gray-50 rounded-b-lg">
                <div className="col-span-3 font-bold text-gray-800">Total Investment</div>
                <div className="col-span-2 text-right font-mono font-bold text-blue-600 text-lg">₹{totalBudget.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{rawText}</p>
          </div>
        )}
      </div>
    </SlideWrapper>
  );
};

export default BudgetSlide;