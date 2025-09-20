// import { useState } from "react";
// import IntroSlide from '../components/templates/professional/IntroSlide';
// import ProblemSlide from '../components/templates/professional/ProblemSlide';
// import SolutionSlide from '../components/templates/professional/SolutionSlide';
// import TimelineSlide from '../components/templates/professional/TimelineSlide';
// import BudgetSlide from '../components/templates/professional/BudgetSlide';
// import USPSlide from '../components/templates/professional/USPSlide';
// // --- Helper Functions ---
// // All necessary helpers are included directly in this file for simplicity and reliability.

// type SectionMap = Record<string, string | string[]>;

// const parseMarkdown = (markdown: string): SectionMap => {
//     const lines = markdown.split("\n");
//     const sections: SectionMap = {};
//     let currentKey: string | null = null;
//     let buffer: string[] = [];

//    const flushBuffer = () => {
//         if (currentKey && buffer.length > 0) {
//             const cleanedBuffer = buffer.map(l => l.trim()).filter(Boolean);
//             if (cleanedBuffer.some(l => l.startsWith('* ') || l.startsWith('- '))) {
//                 sections[currentKey] = cleanedBuffer.map(l => l.replace(/^[* -]\s*/, ''));
//             } else {
//                 sections[currentKey] = cleanedBuffer.join("\n");
//             }
//         }
//         buffer = [];
//     };

//     for (const line of lines) {
//         const headingMatch = line.match(/^##?\s+(.*)/);
//         if (headingMatch) {
//             flushBuffer();
//             currentKey = headingMatch[1].trim();
//         } else if (currentKey) {
//             buffer.push(line);
//         }
//     }
//     flushBuffer();
//     return sections;
// };

// // --- Normalization Functions ---
// // These are now back to handle specific data formats gracefully.

// const normalizeTimeline = (content: string | string[]): { phase: string; duration: string; details: string }[] => {
//     const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
//     return lines.map((line, i) => {
//         if (!line || line.includes('---')) return null; // Ignore markdown table separators
//         const cleanedLine = line.replace(/\|/g, '').trim(); // Remove table pipes
//         if (!cleanedLine) return null;

//         const durationMatch = cleanedLine.match(/\((.*?)\)/);
//         const duration = durationMatch ? durationMatch[1] : '';
//         const phaseAndDetails = cleanedLine.replace(/\(.*?\)/, '').trim();
//         const parts = phaseAndDetails.split(/:(.*)/s);
//         const phase = parts[0].trim().replace(/[* -]/g, '') || `Phase ${i + 1}`;
//         const details = (parts[1] || 'Details to be determined.').trim();
//         return { phase, duration, details };
//     }).filter(Boolean) as { phase: string; duration: string; details: string }[];
// };


// const normalizeBudget = (content: string | string[]): { label: string; value: number }[] => {
//     const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
//     return lines.map(line => {
//         if (!line || line.includes('---') || line.toLowerCase().includes('item')) return null; // Ignore headers/separators
//         const cleanedLine = line.replace(/\|/g, '').trim();
//         if (!cleanedLine) return null;
        
//         const parts = cleanedLine.split(/:(.*)/s);
//         let label = parts[0].trim().replace(/[* -]/g, '');
//         let valueString = (parts[1] || '0').trim();

//         // Handle cases where there is no colon, assume last word is the value
//         if (parts.length === 1) {
//             const words = cleanedLine.split(' ');
//             valueString = words.pop() || '0';
//             label = words.join(' ');
//         }

//         const value = parseInt(valueString.replace(/[^\d]/g, ""), 10) || 0;
//         if (!label) return null;
//         return { label, value };
//     }).filter(Boolean) as { label: string; value: number }[];
// };


// const normalizeUSP = (content: string | string[]): { title: string }[] => {
//     const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
//     return lines.map(line => {
//         const cleanedLine = line.replace(/\|/g, '').replace(/[* -]/g, '').trim();
//         if (!cleanedLine) return null;
//         return { title: cleanedLine };
//     }).filter(Boolean) as { title: string }[];
// };


// // --- The Main Dashboard Component ---
// const Dashboard: React.FC = () => {
//     const [goal, setGoal] = useState<string>("");
//     const [audience, setAudience] = useState<string>("");
//     const [tone, setTone] = useState<string>("Formal");
//     const [budget, setBudget] = useState<string>("");
//     const [timeline, setTimeline] = useState<string>("");
//     const [usp, setUSP] = useState<string>("");
//     const [sections, setSections] = useState<SectionMap | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleSubmit = async () => {
//         setLoading(true);
//         setSections(null);
//         setError(null);
//         try {
//             const response = await fetch("http://localhost:5000/generate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ goal, audience, tone, budget, timeline, usp }),
//             });
//             if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
//             const data = await response.json();
//             if (data.proposal) {
//                 setSections(parseMarkdown(data.proposal));
//             } else {
//                 setError("No proposal content was generated.");
//             }
//         } catch (err: unknown) {
//             if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError("An unknown error occurred.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

  

//     // --- The Render Logic ---
//     return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* --- Input Form Column --- */}
//             <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg h-fit">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Proposal Devta</h1>
//                 <div className="space-y-4">
//                     <div><label className="block font-semibold text-gray-700 mb-1">🎯 Goal</label><textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Launch a new marketing campaign" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
//                     <div><label className="block font-semibold text-gray-700 mb-1">👥 Target Audience</label><input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Tech-savvy millennials" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
//                     <div><label className="block font-semibold text-gray-700 mb-1">📝 Tone</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"><option>Formal</option><option>Persuasive</option><option>Concise</option><option>Friendly</option></select></div>
//                     <div><label className="block font-semibold text-gray-700 mb-1">💰 Budget</label><input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., $10,000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
//                     <div><label className="block font-semibold text-gray-700 mb-1">⏳ Timeline</label><input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 6 weeks" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
//                     <div><label className="block font-semibold text-gray-700 mb-1">🌟 Unique Selling Points</label><textarea value={usp} onChange={(e) => setUSP(e.target.value)} placeholder="e.g., AI-powered analytics" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
//                     <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400" disabled={loading}>{loading ? "Generating..." : "Generate Proposal"}</button>
//                 </div>
//             </div>

//             {/* --- Output Column --- */}
//             <div className="lg:col-span-2 space-y-8">
//                 {loading && (
//                     <div className="text-center text-gray-500 pt-24">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                         <p className="mt-4">Generating your professional proposal...</p>
//                     </div>
//                 )}
//                 {error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">Error: {error}</div>}
//                 {!loading && !sections && !error && (
//                     <div className="text-center text-gray-400 h-full flex items-center justify-center">
//                          <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl">
//                             <h3 className="text-xl font-semibold text-gray-500">Your Generated Slides Will Appear Here</h3>
//                             <p className="mt-2 text-gray-400">Fill out the form and click "Generate Proposal" to begin.</p>
//                         </div>
//                     </div>
//                 )}

//                 {sections && (
//                     <>
//                         {sections["Title"] && (
//                             <IntroSlide
//                                 title={sections["Title"] as string}
//                                 subtitle={sections["Executive Summary"] as string || ""}
//                                 pageNumber={1}
//                             />
//                         )}
//                         {sections["Problem Statement"] && (
//                             <ProblemSlide
//                                 problems={Array.isArray(sections["Problem Statement"]) ? sections["Problem Statement"] as string[] : [sections["Problem Statement"] as string]}
//                                 pageNumber={2}
//                             />
//                         )}
//                         {sections["Proposed Solution"] && (
//                             <SolutionSlide
//                                 solutions={Array.isArray(sections["Proposed Solution"]) ? sections["Proposed Solution"] as string[] : [sections["Proposed Solution"] as string]}
//                                 pageNumber={3}
//                             />
//                         )}
//                         {sections["Timeline"] && (
//                             <TimelineSlide
//                                 timeline={normalizeTimeline(sections["Timeline"])}
//                                 rawText={!Array.isArray(sections["Timeline"]) ? sections["Timeline"] as string : undefined}
//                                 pageNumber={4}
//                             />
//                         )}
//                          {sections["Budget"] && (
//                             <BudgetSlide
//                                 items={normalizeBudget(sections["Budget"])}
//                                 rawText={typeof sections["Budget"] === 'string' ? sections["Budget"] as string : undefined}
//                                 pageNumber={5}
//                             />
//                         )}
//                         {sections["Unique Selling Points"] && (
//                             <USPSlide
//                                 points={normalizeUSP(sections["Unique Selling Points"])}
//                                 pageNumber={6}
//                             />
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     </div>
// );
// };

// export default Dashboard;

import { useState } from "react";

// --- Helper Functions ---
// (These are the same robust functions from our last step)
type SectionMap = Record<string, string | string[]>;

const parseMarkdown = (markdown: string): SectionMap => {
    const lines = markdown.split("\n");
    const sections: SectionMap = {};
    let currentKey: string | null = null;
    let buffer: string[] = [];

    const flushBuffer = () => {
        if (currentKey && buffer.length > 0) {
            const cleanedBuffer = buffer.map(l => l.trim()).filter(Boolean);
            if (cleanedBuffer.some(l => l.startsWith('* ') || l.startsWith('- '))) {
                sections[currentKey] = cleanedBuffer.map(l => l.replace(/^[* -]\s*/, ''));
            } else {
                sections[currentKey] = cleanedBuffer.join("\n");
            }
        }
        buffer = [];
    };

    for (const line of lines) {
        const mainTitleMatch = line.match(/^#\s+(?!#)(.*)/);
        const subHeadingMatch = line.match(/^##\s+(.*)/);

        if (mainTitleMatch) {
            flushBuffer();
            sections["Title"] = mainTitleMatch[1].trim();
            currentKey = "Executive Summary"; // Assume text after title is summary
        } else if (subHeadingMatch) {
            flushBuffer();
            currentKey = subHeadingMatch[1].trim();
        } else if (currentKey) {
            buffer.push(line);
        }
    }
    flushBuffer();
    return sections;
};

const normalizeTimeline = (content: string | string[]): { phase: string; duration: string; details: string }[] => {
    const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
    return lines.map((line, i) => {
        if (!line || line.includes('---')) return null;
        let cleanedLine = line.replace(/\|/g, '').trim();
        if (!cleanedLine) return null;

        const durationMatch = cleanedLine.match(/\((.*?)\)/);
        const duration = durationMatch ? durationMatch[1] : '';
        cleanedLine = cleanedLine.replace(/\(.*?\)/, '').trim();
        
        const parts = cleanedLine.split(/:(.*)/s);
        const phase = parts[0].trim().replace(/[*#-]/g, '').trim() || `Phase ${i + 1}`;
        const details = (parts[1] || 'Details to be determined.').trim();
        return { phase, duration, details };
    }).filter(Boolean) as { phase: string; duration: string; details: string }[];
};

const normalizeBudget = (content: string | string[]): { label: string; value: number }[] => {
    const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
    return lines.map(line => {
        if (!line || line.includes('---') || line.toLowerCase().includes('item') || line.toLowerCase().includes('cost') || line.toLowerCase().includes('total')) return null;
        const cleanedLine = line.replace(/\|/g, '').trim();
        if (!cleanedLine) return null;
        
        const parts = cleanedLine.split(/:(.*)/s);
        let label = parts[0].trim().replace(/[*#-]/g, '').trim();
        let valueString = (parts[1] || '0').trim();

        if (parts.length === 1 && label) {
            const words = label.split(/\s+/);
            const lastWord = words[words.length - 1];
            if (lastWord.match(/[$,€₹£]?\d/)) {
                 valueString = words.pop() || '0';
                 label = words.join(' ');
            }
        }

        const value = parseInt(valueString.replace(/[^\d]/g, ""), 10) || 0;
        if (!label) return null;
        return { label, value };
    }).filter(Boolean) as { label: string; value: number }[];
};

const normalizeUSP = (content: string | string[]): { title: string }[] => {
    const lines = Array.isArray(content) ? content.join('\n').split('\n') : content.split('\n');
    return lines.map(line => {
        const cleanedLine = line.replace(/\|/g, '').replace(/[*#-]/g, '').trim();
        if (!cleanedLine) return null;
        return { title: cleanedLine };
    }).filter(Boolean) as { title: string }[];
};


// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
    const [goal, setGoal] = useState<string>("");
    const [audience, setAudience] = useState<string>("");
    const [tone, setTone] = useState<string>("Formal");
    const [budget, setBudget] = useState<string>("");
    const [timeline, setTimeline] = useState<string>("");
    const [usp, setUSP] = useState<string>("");
    const [sections, setSections] = useState<SectionMap | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- NEW: State for Theme Selection ---
    const [theme, setTheme] = useState<string>('professional');

    const handleSubmit = async () => {
        setLoading(true);
        setSections(null);
        setError(null);
        try {
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal, audience, tone, budget, timeline, usp }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const data = await response.json();
            if (data.proposal) {
                setSections(parseMarkdown(data.proposal));
            } else {
                setError("No proposal content was generated.");
            }
        } catch (err: unknown) {
            if (err instanceof Error) { setError(err.message); } 
            else { setError("An unknown error occurred."); }
        } finally {
            setLoading(false);
        }
    };

    // --- UPGRADED Master Slide Template with Theme Logic ---
    const SlideWrapper: React.FC<{ slideTitle: string; pageNumber: number; children: React.ReactNode; companyName?: string;}> = ({ children, slideTitle, pageNumber, companyName = "Proposal Devta" }) => {
        
        const themeClasses = {
            professional: {
                bg: 'bg-white',
                headerText: 'text-gray-700',
                brandText: 'text-blue-600',
                accentBar: 'bg-blue-600',
                footerText: 'text-gray-400',
            },
            dark: {
                bg: 'bg-gray-800',
                headerText: 'text-white',
                brandText: 'text-cyan-400',
                accentBar: 'bg-cyan-400',
                footerText: 'text-gray-500',
            },
            creative: {
                bg: 'bg-amber-50',
                headerText: 'text-amber-900',
                brandText: 'text-red-500',
                accentBar: 'bg-red-500',
                footerText: 'text-amber-700',
            }
        }[theme] || { bg: 'bg-white', headerText: 'text-gray-700', brandText: 'text-blue-600', accentBar: 'bg-blue-600', footerText: 'text-gray-400' };

        return (
            <div className={`w-full aspect-video ${themeClasses.bg} rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-colors duration-500`}>
                 <header className="p-8 md:p-10 border-b-2 border-gray-100/10">
                    <div className="flex justify-between items-center">
                        <h2 className={`text-xl font-bold ${themeClasses.headerText}`}>{slideTitle}</h2>
                        <h3 className={`text-lg font-semibold ${themeClasses.brandText}`}>{companyName}</h3>
                    </div>
                    <div className={`mt-2 h-1 w-20 ${themeClasses.accentBar} rounded-full`}></div>
                </header>
                <main className="flex-grow py-6 px-8 md:px-10 text-left overflow-auto">{children}</main>
                <footer className={`mt-auto border-t border-gray-100/10 p-4 text-right ${themeClasses.footerText}`}>
                    <p className="text-sm">Page {pageNumber}</p>
                </footer>
            </div>
        );
    };
    
    // --- Fallback Component ---
    const FallbackSlide: React.FC<{text: string | string[]}> = ({ text }) => (
        <div className={`p-6 rounded-lg h-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
            <p className="whitespace-pre-wrap">{Array.isArray(text) ? text.join('\n') : text}</p>
        </div>
    );

    // --- Render Logic ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form Column */}
                <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg h-fit">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Proposal Devta</h1>
                     <div className="space-y-4">
                        {/* ... form inputs ... */}
                        <div><label className="block font-semibold text-gray-700 mb-1">🎯 Goal</label><textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Launch a new marketing campaign" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
                        <div><label className="block font-semibold text-gray-700 mb-1">👥 Target Audience</label><input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Tech-savvy millennials" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                        <div><label className="block font-semibold text-gray-700 mb-1">📝 Tone</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"><option>Formal</option><option>Persuasive</option><option>Concise</option><option>Friendly</option></select></div>
                        
                        {/* --- NEW: Theme Selector --- */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">🎨 Theme</label>
                            <div className="flex space-x-2">
                                <button onClick={() => setTheme('professional')} className={`flex-1 p-2 rounded-lg text-sm font-semibold border-2 ${theme === 'professional' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white'}`}>Professional</button>
                                <button onClick={() => setTheme('dark')} className={`flex-1 p-2 rounded-lg text-sm font-semibold border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white'}`}>Dark</button>
                                <button onClick={() => setTheme('creative')} className={`flex-1 p-2 rounded-lg text-sm font-semibold border-2 ${theme === 'creative' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 bg-white'}`}>Creative</button>
                            </div>
                        </div>

                        <div><label className="block font-semibold text-gray-700 mb-1">💰 Budget</label><input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., $10,000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                        <div><label className="block font-semibold text-gray-700 mb-1">⏳ Timeline</label><input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 6 weeks" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                        <div><label className="block font-semibold text-gray-700 mb-1">🌟 Unique Selling Points</label><textarea value={usp} onChange={(e) => setUSP(e.target.value)} placeholder="e.g., AI-powered analytics" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
                        <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400" disabled={loading}>{loading ? "Generating..." : "Generate Proposal"}</button>
                    </div>
                </div>

                {/* Output Column */}
                <div className="lg:col-span-2 space-y-8">
                    {loading && <div className="text-center text-gray-500 pt-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4">Generating your professional proposal...</p></div>}
                    {error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">Error: {error}</div>}
                    {!loading && !sections && !error && <div className="text-center text-gray-400 h-full flex items-center justify-center"><div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl"><h3 className="text-xl font-semibold text-gray-500">Your Generated Slides Will Appear Here</h3><p className="mt-2 text-gray-400">Fill out the form and click "Generate Proposal" to begin.</p></div></div>}

                    {sections && (
                         <>
                            {/* --- Intro Slide --- */}
                            {sections["Title"] && <SlideWrapper slideTitle={sections["Title"] as string} pageNumber={1}><div className={`h-full flex items-center justify-center ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'}`}><p className="text-xl max-w-3xl leading-relaxed text-center mx-auto">{sections["Executive Summary"] as string || ""}</p></div></SlideWrapper>}
                            
                            {/* --- Problem Slide --- */}
                            {sections["Problem Statement"] && <SlideWrapper slideTitle="Problem Statement" pageNumber={2}><div className={`space-y-4 ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'}`}>{ (Array.isArray(sections["Problem Statement"]) ? sections["Problem Statement"] : [sections["Problem Statement"] as string]).map((problem, index) => (<div key={index} className="flex items-start"><div className="flex-shrink-0 mt-1"><svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div><p className="ml-4 text-lg">{problem}</p></div>)) }</div></SlideWrapper>}

                            {/* --- Solution Slide --- */}
                            {sections["Proposed Solution"] && <SlideWrapper slideTitle="Proposed Solution" pageNumber={3}><div className={`space-y-4 ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'}`}>{ (Array.isArray(sections["Proposed Solution"]) ? sections["Proposed Solution"] : [sections["Proposed Solution"] as string]).map((solution, index) => (<div key={index} className="flex items-start"><div className="flex-shrink-0 mt-1"><svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="ml-4 text-lg">{solution}</p></div>)) }</div></SlideWrapper>}

                            {/* --- Timeline Slide --- */}
                            {sections["Timeline"] && <SlideWrapper slideTitle="Project Timeline" pageNumber={4}>{ (() => { const items = normalizeTimeline(sections["Timeline"]); return items.length > 1 ? (<div className="relative pl-6"><div className="absolute left-0 top-0 h-full w-0.5 bg-blue-200"></div><div className="space-y-8">{ items.map((item, idx) => (<div key={idx} className="relative"><div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div><div className="pl-4"><p className={`text-sm font-semibold uppercase tracking-wider ${theme==='dark' ? 'text-blue-400' : 'text-blue-600'}`}>{item.phase} - {item.duration}</p><p className={`mt-1 ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.details}</p></div></div>)) }</div></div>) : <FallbackSlide text={sections["Timeline"]} />; })() }</SlideWrapper>}

                            {/* --- Budget Slide --- */}
                            {sections["Budget"] && <SlideWrapper slideTitle="Investment Overview" pageNumber={5}>{ (() => { const items = normalizeBudget(sections["Budget"]); const totalBudget = items.reduce((sum, item) => sum + item.value, 0); return items.length > 0 ? ( <> <p className={`${theme==='dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>A transparent breakdown of the projected costs for this initiative. All figures are in INR.</p> <div className={`${theme==='dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}><div className={`grid grid-cols-5 gap-4 p-4 ${theme==='dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-t-lg`}><div className="col-span-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Description</div><div className="col-span-2 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Cost</div></div><div className={`divide-y ${theme==='dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>{items.map((item, idx) => ( <div key={idx} className="grid grid-cols-5 gap-4 p-4 items-center"><div className="col-span-3 flex items-center"><div className={`${theme==='dark' ? 'text-blue-400' : 'text-blue-600'} mr-3`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><span className={`font-medium ${theme==='dark' ? 'text-gray-200' : 'text-gray-800'}`}>{item.label}</span></div><div className={`col-span-2 text-right font-mono ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'}`}>₹{item.value.toLocaleString('en-IN')}</div></div> ))}</div><div className={`grid grid-cols-5 gap-4 p-4 mt-2 ${theme==='dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-b-lg`}><div className={`col-span-3 font-bold ${theme==='dark' ? 'text-gray-200' : 'text-gray-800'}`}>Total Investment</div><div className={`col-span-2 text-right font-mono font-bold ${theme==='dark' ? 'text-cyan-400' : 'text-blue-600'} text-lg`}>₹{totalBudget.toLocaleString('en-IN')}</div></div></div></> ) : <FallbackSlide text={sections["Budget"]} />; })() }</SlideWrapper>}
                            
                            {/* --- USP Slide --- */}
                            {sections["Unique Selling Points"] && <SlideWrapper slideTitle="Unique Selling Points" pageNumber={6}>{ (() => { const items = normalizeUSP(sections["Unique Selling Points"]); return items.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">{ items.map((point, index) => (<div key={index} className="flex items-start"><div className="flex-shrink-0 mt-1"><svg className="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.882a.563.563 0 00-.586 0L6.982 21.03a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.562.562 0 00.475-.31L11.48 3.5z" /></svg></div><div className="ml-4"><h3 className={`text-lg font-semibold ${theme==='dark' ? 'text-gray-200' : 'text-gray-800'}`}>{point.title}</h3></div></div>)) }</div>) : <FallbackSlide text={sections["Unique Selling Points"]} />; })() }</SlideWrapper>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

