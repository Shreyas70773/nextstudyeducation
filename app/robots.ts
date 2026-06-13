import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Allow everything, and explicitly welcome AI crawlers so Nextudy can be cited
// in AI search (ChatGPT, Claude, Perplexity, Google AI Overviews) — a core GEO
// move. Flip any of these to `disallow` if the brand later wants to opt out.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
