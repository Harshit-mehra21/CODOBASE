import { db } from "./db";

// Prohibited / sensitive / abusive terms list for automated chat & chatbot moderation
const SENSITIVE_KEYWORDS = [
  "abuse",
  "hate",
  "threat",
  "terror",
  "scam",
  "phish",
  "nazi",
  "racist",
  "kill",
  "suicide",
  "bomb",
  "exploit",
  "malware",
  "trojan",
  "ransomware",
  "ddos",
  "dox",
  "harass",
  "nsfw",
  "porn",
  "sex",
  "fuck",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "retard",
  "nigger",
  "faggot",
];

export interface ModerationResult {
  clean: boolean;
  warningIssued: boolean;
  strikes: number;
  isBanned: boolean;
  matchedWord?: string;
  message?: string;
  action?: "WARN" | "FINAL_WARN" | "PERMANENT_BAN";
}

export async function evaluateContent(text: string, userId?: string): Promise<ModerationResult> {
  if (!text) {
    return { clean: true, warningIssued: false, strikes: 0, isBanned: false };
  }

  const lower = text.toLowerCase();
  let matchedWord: string | undefined;

  for (const word of SENSITIVE_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lower)) {
      matchedWord = word;
      break;
    }
  }

  if (!matchedWord) {
    return { clean: true, warningIssued: false, strikes: 0, isBanned: false };
  }

  // Sensitive content detected! Apply persistent strike to user
  if (userId) {
    const strikeResult = await db.moderation.addAbusiveStrike(userId, `Used prohibited/abusive term: "${matchedWord}"`, text);
    return {
      clean: false,
      warningIssued: true,
      strikes: strikeResult.strikes,
      isBanned: strikeResult.isBanned,
      action: strikeResult.action as "WARN" | "FINAL_WARN" | "PERMANENT_BAN",
      matchedWord,
      message: strikeResult.isBanned
        ? "🚨 STRIKE 3/3: Your account and associated email have been permanently banned from CodeBase for repeated violations."
        : `⚠️ Community Moderation Warning (${strikeResult.strikes}/3): Inappropriate/abusive language detected.`,
    };
  }

  return {
    clean: false,
    warningIssued: true,
    strikes: 1,
    isBanned: false,
    matchedWord,
    message: `⚠️ Warning: Sensitive content detected ("${matchedWord}"). Please adhere to community guidelines.`,
  };
}
