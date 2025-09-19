import { useState } from "react";

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

const normalizeTimeline = (content: string | string[]): { phase: string; details: string }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map((line, i) => {
        if (!line) return null;
        // Simple split by the first colon for details
        const parts = line.split(/:(.*)/s);
        const phase = parts[0].trim() || `Phase ${i + 1}`;
        const details = (parts[1] || 'Details to be determined.').trim();
        return { phase, details };
    }).filter(Boolean) as { phase: string; details: string }[];
};

const normalizeBudget = (content: string | string[]): { item: string; cost: string }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map(line => {
        if (!line) return null;
        const parts = line.split(/:(.*)/s);
        const item = parts[0].trim();
        const cost = (parts[1] || 'TBD').trim();
        return { item, cost };
    }).filter(Boolean) as { item: string; cost: string }[];
};

const normalizeUSP = (content: string | string[]): { title: string }[] => {
    const lines = Array.isArray(content) ? content : [content];
    return lines.map(line => {
        if (!line || !line.trim()) return null;
        return { title: line.trim() };
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

    // Generic slide wrapper component defined directly inside for simplicity
    const SlideWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="w-full aspect-video bg-white rounded-xl shadow-2xl flex flex-col p-8 md:p-12 font-sans">
            <header className="flex-shrink-0 border-b-2 border-gray-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">{title}</h2>
            </header>
            <main className="flex-grow text-gray-700 text-lg text-left overflow-auto">
                {children}
            </main>
        </div>
    );

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

                {/* --- Output Column (Now 2 columns wide) --- */}
                <div className="lg:col-span-2 space-y-8">
                    {loading && <div className="text-center text-gray-500">Generating your professional proposal...</div>}
                    {error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">Error: {error}</div>}
                    {!loading && !sections && !error && <div className="text-center text-gray-400 pt-24">Your generated slides will appear here.</div>}
                    
                    {sections && (
                        <>
                            {sections["Title"] && (
                                <SlideWrapper title={sections["Title"] as string}>
                                    <p className="whitespace-pre-wrap text-center text-xl">{sections["Executive Summary"]}</p>
                                </SlideWrapper>
                            )}
                             {sections["Problem Statement"] && (
                                <SlideWrapper title="Problem Statement">
                                    <ul className="space-y-4 list-disc pl-5">
                                        {(Array.isArray(sections["Problem Statement"]) ? sections["Problem Statement"] : [sections["Problem Statement"]]).map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </SlideWrapper>
                            )}
                             {sections["Proposed Solution"] && (
                                <SlideWrapper title="Proposed Solution">
                                    <ul className="space-y-4 list-disc pl-5">
                                         {(Array.isArray(sections["Proposed Solution"]) ? sections["Proposed Solution"] : [sections["Proposed Solution"]]).map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </SlideWrapper>
                            )}
                             {sections["Timeline"] && (
                                <SlideWrapper title="Timeline">
                                    <div className="space-y-6">
                                        {normalizeTimeline(sections["Timeline"]).map(({ phase, details }, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="font-bold text-blue-600 w-1/4">{phase}</div>
                                                <div className="w-3/4">{details}</div>
                                            </div>
                                        ))}
                                    </div>
                                </SlideWrapper>
                            )}
                            {sections["Budget"] && (
                                <SlideWrapper title="Budget">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="pb-2 w-3/4">Item</th>
                                                <th className="pb-2 w-1/4">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {normalizeBudget(sections["Budget"]).map(({ item, cost }, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-3">{item}</td>
                                                    <td className="py-3">{cost}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </SlideWrapper>
                            )}
                             {sections["Unique Selling Points"] && (
                                <SlideWrapper title="Unique Selling Points">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {normalizeUSP(sections["Unique Selling Points"]).map(({ title }, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-blue-700">✔ {title}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </SlideWrapper>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

