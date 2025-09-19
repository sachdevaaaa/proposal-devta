// This file will hold your data processing functions

type SectionMap = Record<string, string | string[]>;

export const normalizeTimeline = (arr: string[]): { phase: string; duration: string; details: string }[] => {
  return arr
    .map((line, i) => {
      if (!line) return null; // skip empty
      let duration = "";
      let details = line;
      if (line.includes(":")) {
        const parts = line.split(":");
        duration = parts[0].trim();
        details = parts.slice(1).join(":").trim();
      }
      return { phase: `Phase ${i + 1}`, duration, details };
    })
    .filter(Boolean) as { phase: string; duration: string; details: string }[];
};

export const normalizeBudget = (arr: string[]): { label: string; value: number }[] => {
  return arr
    .map((b) => {
      const [label, value] = b.split(":").map((s) => s.trim());
      if (!label || !value) return null; // skip invalid entries
      const numericValue = parseInt(value.replace(/[^\d]/g, "")) || 0;
      return { label, value: numericValue };
    })
    .filter(Boolean) as { label: string; value: number }[];
};

export const normalizeUSP = (arr: string[]): { title: string; description?: string }[] => {
  return arr
    .map((p) => {
      if (!p || !p.trim()) return null; // skip empty lines
      return { title: p.trim() };
    })
    .filter(Boolean) as { title: string; description?: string }[];
};

export const parseMarkdown = (markdown: string): SectionMap => {
  const lines = markdown.split("\n");
  const sections: SectionMap = {};
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
  if (currentKey) {
    const text = buffer.join("\n").trim();
    // If any line starts with "- ", treat as array
    if (buffer.some((l) => l.trim().startsWith("- "))) {
      sections[currentKey] = buffer
        .filter((l) => l.trim().startsWith("- "))
        .map((l) => l.replace(/^- /, "").trim());
    } else {
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
