import { getJsonLd } from "@/lib/seo";

// Structured data for rich results + generative-engine citability.
// Rendered once on the page as a single @graph (Organization, WebSite, Course
// list, FAQPage). Server component, no client JS.
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Data is fully controlled (no user input), so this is safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd()) }}
    />
  );
}
