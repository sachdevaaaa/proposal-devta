// src/components/templates/index.ts
import * as Professional from "./professional";
import * as Casual from "./casual";
import * as Persuasive from "./persuasive";

export function getTemplateByTone(tone: string) {
  switch (tone.toLowerCase()) {
    case "casual":
      return Casual;
    case "persuasive":
      return Persuasive;
    default:
      return Professional; // fallback
  }
}
