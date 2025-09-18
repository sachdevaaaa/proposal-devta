import { useState } from "react";
import type { ChangeEvent } from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";

import IntroSlide from "../components/templates/professional/IntroSlide";
import ProblemSlide from "../components/templates/professional/ProblemSlide";
import SolutionSlide from "../components/templates/professional/SolutionSlide";
import TimelineSlide from "../components/templates/professional/TimelineSlide";
import BudgetSlide from "../components/templates/professional/BudgetSlide";
import USPSlide from "../components/templates/professional/USPSlide";


const normalizeTimeline = (arr: string[]): { phase: string; duration: string; details: string }[] => {
  return arr.map((line, i) => {
    // Try to split by colon or dash for duration/details if available
    let duration = "";
    let details = line;
    if (line.includes(":")) {
      const parts = line.split(":");
      duration = parts[0].trim();
      details = parts.slice(1).join(":").trim();
    }
    return { phase: `Phase ${i + 1}`, duration, details };
  });
};

const normalizeBudget = (arr: string[]): { label: string; value: number }[] => {
  return arr.map((b) => {
    const [label, value] = b.split(":").map((s) => s.trim());
    return { label, value: parseInt(value.replace(/[^\d]/g, "")) || 0 };
  });
};

const normalizeUSP = (arr: string[]): { title: string; description?: string }[] => {
  return arr.map((p) => ({ title: p }));
};


type SectionMap = Record<string, string | string[]>;

const parseMarkdown = (markdown: string): SectionMap => {
  const lines = markdown.split("\n");
  const sections: SectionMap = {};
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
  if (currentKey) {
    const text = buffer.join("\n").trim();
    // If any line starts with "- ", treat as array
    if (buffer.some((l) => l.startsWith("- "))) {
      sections[currentKey] = buffer
        .filter((l) => l.startsWith("- "))
        .map((l) => l.replace(/^- /, "").trim());
    } else if (buffer.length > 1) {
      // multiple lines without "-", treat each line as array
      sections[currentKey] = buffer.map((l) => l.trim()).filter((l) => l);
    } else {
      // single line
      sections[currentKey] = text;
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

const Dashboard: React.FC = () => {
  const [goal, setGoal] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [tone, setTone] = useState<string>("Formal");
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [usp, setUSP] = useState<string>("");
  const [proposalText, setProposalText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoalChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setGoal(e.target.value);
  const handleAudienceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAudience(e.target.value);
  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setTone(e.target.value);
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBudget(e.target.value);
  const handleTimelineChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTimeline(e.target.value);
  const handleUSPChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setUSP(e.target.value);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(proposalText, 10, 10);
    doc.save("proposal.pdf");
  };

  const handleExportDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph(proposalText)],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "proposal.docx");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setProposalText(""); // clear old text
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal, audience, tone, budget, timeline, usp }),
      });

      const data = await response.json();
      setProposalText(data.proposal || "⚠️ No proposal generated.");
    } catch (err) {
      console.error("Error generating proposal:", err);
      setProposalText("❌ Error generating proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
          Proposal Devta
        </h1>

        <div className="space-y-5">
          {/* Goal */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              🎯 Goal
            </label>
            <textarea
              value={goal}
              onChange={handleGoalChange}
              placeholder="What is your proposal about?"
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              rows={3}
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              👥 Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={handleAudienceChange}
              placeholder="Who is this proposal for?"
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              📝 Tone
            </label>
            <select
              value={tone}
              onChange={handleToneChange}
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            >
              <option>Formal</option>
              <option>Persuasive</option>
              <option>Concise</option>
              <option>Friendly</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              💰 Budget
            </label>
            <input
              type="text"
              value={budget}
              onChange={handleBudgetChange}
              placeholder="e.g. $5,000 or ₹3,00,000"
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              ⏳ Timeline
            </label>
            <input
              type="text"
              value={timeline}
              onChange={handleTimelineChange}
              placeholder="e.g. 3 months, Q4 2025"
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            />
          </div>

          {/* USP */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              🌟 Unique Selling Points
            </label>
            <textarea
              value={usp}
              onChange={handleUSPChange}
              placeholder="What makes your proposal unique?"
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Proposal"}
          </button>

          {/* Proposal Output */}
          {proposalText && (
  <div className="mt-6 p-4 border border-pink-200 bg-pink-50 rounded-lg">
    {(() => {
      const sections = parseMarkdown(proposalText);

      return (
        <>
          <IntroSlide
            title={(sections["Title"] as string) || "Untitled Proposal"}
            subtitle={(sections["Executive Summary"] as string) || ""}
          />

          <ProblemSlide
            problems={Array.isArray(sections["Problem Statement"])
              ? (sections["Problem Statement"] as string[])
              : [(sections["Problem Statement"] as string) || ""]}
          />

          <SolutionSlide
            solutions={Array.isArray(sections["Proposed Solution"])
              ? (sections["Proposed Solution"] as string[])
              : [(sections["Proposed Solution"] as string) || ""]}
          />

          <TimelineSlide
  timeline={normalizeTimeline(
    Array.isArray(sections["Timeline"])
      ? (sections["Timeline"] as string[])
      : [(sections["Timeline"] as string) || ""]
  )}
/>

<BudgetSlide
  items={normalizeBudget(
    Array.isArray(sections["Budget"])
      ? (sections["Budget"] as string[])
      : [(sections["Budget"] as string) || ""]
  )}
/>

<USPSlide
  points={normalizeUSP(
    Array.isArray(sections["Unique Selling Points"])
      ? (sections["Unique Selling Points"] as string[])
      : [(sections["Unique Selling Points"] as string) || ""]
  )}
/>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleExportPDF}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow"
                      >
                        Export as PDF
                      </button>
                      <button
                        onClick={handleExportDOCX}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg shadow"
                      >
                        Export as DOCX
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
