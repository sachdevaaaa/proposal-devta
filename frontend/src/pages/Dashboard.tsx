import { useState } from "react";
import IntroSlide from '../components/templates/professional/IntroSlide';
import ProblemSlide from '../components/templates/professional/ProblemSlide';
import SolutionSlide from '../components/templates/professional/SolutionSlide';
import TimelineSlide from '../components/templates/professional/TimelineSlide';
import BudgetSlide from '../components/templates/professional/BudgetSlide';
import USPSlide from '../components/templates/professional/USPSlide';
// --- Helper Functions ---
// All necessary helpers are included directly in this file for simplicity and reliability.

type SectionMap = Record<string, string | string[]>;

const parseMarkdown = (markdown: string): SectionMap => {
    const lines = markdown.split("\n").filter(line => line.trim() !== '');
    const sections: SectionMap = {};
    let currentKey: string | null = null;
    let buffer: string[] = [];

    const flushBuffer = () => {
        if (currentKey && buffer.length > 0) {
            // Check for lists (lines starting with * or -)
            if (buffer.some(l => l.trim().startsWith('* ') || l.trim().startsWith('- '))) {
                sections[currentKey] = buffer.map(l => l.trim().replace(/^[* -]\s*/, '')).filter(Boolean);
            } else {
                sections[currentKey] = buffer.join("\n").trim();
            }
        }
        buffer = [];
    };

    for (const line of lines) {
        const headingMatch = line.match(/^##?\s+(.*)/);
        if (headingMatch) {
            flushBuffer();
            currentKey = headingMatch[1].trim();
        } else if (currentKey) {
            buffer.push(line);
        }
    }
    flushBuffer();
    return sections;
};

// --- Normalization Functions ---
// These are now back to handle specific data formats gracefully.

const normalizeTimeline = (content: string | string[]): { phase: string; duration: string; details: string }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map((line, i) => {
        if (!line) return null;
        const durationMatch = line.match(/\((.*?)\)/);
        const duration = durationMatch ? durationMatch[1] : '';
        const phaseAndDetails = line.replace(/\(.*?\)/, '').trim();
        const parts = phaseAndDetails.split(/:(.*)/s);
        const phase = parts[0].trim().replace(/[* -]/g, '') || `Phase ${i + 1}`;
        const details = (parts[1] || 'Details to be determined.').trim();
        return { phase, duration, details };
    }).filter(Boolean) as { phase: string; duration: string; details: string }[];
};

const normalizeBudget = (content: string | string[]): { label: string; value: number }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map(line => {
        if (!line) return null;
        const parts = line.split(/:(.*)/s);
        const label = parts[0].trim().replace(/[* -]/g, '');
        const valueString = (parts[1] || '0').trim();
        const value = parseInt(valueString.replace(/[^\d]/g, ""), 10) || 0;
        if (!label) return null;
        return { label, value };
    }).filter(Boolean) as { label: string; value: number }[];
};

const normalizeUSP = (content: string | string[]): { title: string }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map(line => {
        if (!line || !line.trim()) return null;
        return { title: line.trim().replace(/[* -]/g, '') };
    }).filter(Boolean) as { title: string }[];
};

// --- The Main Dashboard Component ---
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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    // // Generic slide wrapper component defined directly inside for simplicity
    // const SlideWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    //     <div className="w-full aspect-video bg-white rounded-xl shadow-2xl flex flex-col p-8 md:p-12 font-sans">
    //         <header className="flex-shrink-0 border-b-2 border-gray-100 pb-4 mb-6">
    //             <h2 className="text-2xl font-bold text-gray-800 text-center">{title}</h2>
    //         </header>
    //         <main className="flex-grow text-gray-700 text-lg text-left overflow-auto">
    //             {children}
    //         </main>
    //     </div>
    // );

    // --- The Render Logic ---
    return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Input Form Column --- */}
            <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg h-fit">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Proposal Devta</h1>
                <div className="space-y-4">
                    <div><label className="block font-semibold text-gray-700 mb-1">🎯 Goal</label><textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Launch a new marketing campaign" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
                    <div><label className="block font-semibold text-gray-700 mb-1">👥 Target Audience</label><input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Tech-savvy millennials" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                    <div><label className="block font-semibold text-gray-700 mb-1">📝 Tone</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"><option>Formal</option><option>Persuasive</option><option>Concise</option><option>Friendly</option></select></div>
                    <div><label className="block font-semibold text-gray-700 mb-1">💰 Budget</label><input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., $10,000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                    <div><label className="block font-semibold text-gray-700 mb-1">⏳ Timeline</label><input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 6 weeks" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                    <div><label className="block font-semibold text-gray-700 mb-1">🌟 Unique Selling Points</label><textarea value={usp} onChange={(e) => setUSP(e.target.value)} placeholder="e.g., AI-powered analytics" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows={2}/></div>
                    <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400" disabled={loading}>{loading ? "Generating..." : "Generate Proposal"}</button>
                </div>
            </div>

            {/* --- Output Column --- */}
            <div className="lg:col-span-2 space-y-8">
                {loading && (
                    <div className="text-center text-gray-500 pt-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4">Generating your professional proposal...</p>
                    </div>
                )}
                {error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">Error: {error}</div>}
                {!loading && !sections && !error && (
                    <div className="text-center text-gray-400 h-full flex items-center justify-center">
                         <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-500">Your Generated Slides Will Appear Here</h3>
                            <p className="mt-2 text-gray-400">Fill out the form and click "Generate Proposal" to begin.</p>
                        </div>
                    </div>
                )}

                {sections && (
                    <>
                        {sections["Title"] && (
                            <IntroSlide
                                title={sections["Title"] as string}
                                subtitle={sections["Executive Summary"] as string || ""}
                                pageNumber={1}
                            />
                        )}
                        {sections["Problem Statement"] && (
                            <ProblemSlide
                                problems={Array.isArray(sections["Problem Statement"]) ? sections["Problem Statement"] as string[] : [sections["Problem Statement"] as string]}
                                pageNumber={2}
                            />
                        )}
                        {sections["Proposed Solution"] && (
                            <SolutionSlide
                                solutions={Array.isArray(sections["Proposed Solution"]) ? sections["Proposed Solution"] as string[] : [sections["Proposed Solution"] as string]}
                                pageNumber={3}
                            />
                        )}
                        {sections["Timeline"] && (
                            <TimelineSlide
                                timeline={normalizeTimeline(sections["Timeline"])}
                                rawText={!Array.isArray(sections["Timeline"]) ? sections["Timeline"] as string : undefined}
                                pageNumber={4}
                            />
                        )}
                         {sections["Budget"] && (
                            <BudgetSlide
                                items={normalizeBudget(sections["Budget"])}
                                rawText={typeof sections["Budget"] === 'string' ? sections["Budget"] as string : undefined}
                                pageNumber={5}
                            />
                        )}
                        {sections["Unique Selling Points"] && (
                            <USPSlide
                                points={normalizeUSP(sections["Unique Selling Points"])}
                                pageNumber={6}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
);
};

export default Dashboard;

