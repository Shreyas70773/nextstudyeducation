// Centralized SEO config + JSON-LD builders. Keyword emphasis informed by
// DataForSEO (India): "bim course" 4.4k/mo, "revit course" 1.9k, "bim course
// online" 590, "bim training" 390, "revit training" 320, "bim career" (low comp).
import { brand, programs, faqs } from "./content";

export const SITE_URL = "https://nextudyeducation.com";
export const SITE_NAME = "Nextudy";

export const SITE_TITLE = "Mentor-Led BIM Course & Revit Training | Nextudy";
export const SITE_DESCRIPTION =
  "Nextudy is a mentor-led BIM and Revit training platform turning civil engineers, architects, and graduates into job-ready BIM professionals. Skill up now.";

export const KEYWORDS = [
  "BIM course",
  "Revit course",
  "BIM training",
  "Revit training",
  "online BIM course",
  "BIM certification",
  "Navisworks course",
  "BIM career",
  "BIM for civil engineers",
  "Revit Architecture course",
  "BIM coordinator course",
  "learn Revit",
  "Building Information Modeling course",
  "AEC upskilling",
];

const organization = {
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Nextudy BIM Academy",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/brand/mark.png`,
    width: 675,
    height: 619,
  },
  image: `${SITE_URL}/opengraph-image.png`,
  description: SITE_DESCRIPTION,
  email: brand.email,
  slogan: brand.tagline,
  areaServed: ["IN", "AE", "GB", "Worldwide"],
  knowsAbout: [
    "Building Information Modeling",
    "Autodesk Revit",
    "Navisworks",
    "Clash detection",
    "MEP coordination",
    "Construction documentation",
    "AEC industry workflows",
  ],
  // Add real profile URLs (LinkedIn, Instagram, YouTube) here for stronger entity signals.
  // sameAs: ["https://www.linkedin.com/company/nextudy", ...],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const courseList = {
  "@type": "ItemList",
  "@id": `${SITE_URL}/#programs`,
  name: "Nextudy BIM programs",
  itemListElement: programs.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: `${p.name} Program`,
      description: p.summary,
      url: `${SITE_URL}/#programs`,
      provider: { "@id": `${SITE_URL}/#organization` },
      educationalLevel: "Professional",
      teaches: p.tools.join(", "),
      about: "Building Information Modeling",
    },
  })),
};

const faqPage = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// One @graph keeps the entities cross-referenced (better for rich results + GEO).
export function getJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, courseList, faqPage],
  };
}
