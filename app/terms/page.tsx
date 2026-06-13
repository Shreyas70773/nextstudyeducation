import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of the Nextudy website, inquiry form, and resources.",
};

const UPDATED = "June 13, 2026";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated={UPDATED}
      intro="These terms govern your use of the Nextudy website and the resources we provide. By using the site, you agree to them."
    >
      <h2>1. Acceptance of these terms</h2>
      <p>
        By accessing or using nextudyeducation.com (the &ldquo;site&rdquo;), you agree to be bound by
        these Terms &amp; Conditions and our Privacy Policy. If you do not agree, please do not use the
        site.
      </p>

      <h2>2. About Nextudy</h2>
      <p>
        Nextudy is a mentor-led BIM and AEC upskilling provider. The site presents information about
        our programs and lets you request resources and a conversation with a mentor. Specific program
        details, schedules, fees, and enrollment terms are provided separately at the point of
        enrollment.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 16 years old, or the age of majority in your jurisdiction, to use the
        site and submit an inquiry. By using the site you confirm that the information you provide is
        accurate and that you are entitled to provide it.
      </p>

      <h2>4. Use of the site</h2>
      <p>You agree to use the site lawfully and not to:</p>
      <ul>
        <li>Submit false, misleading, or someone else&rsquo;s information without permission.</li>
        <li>Interfere with, disrupt, or attempt to gain unauthorized access to the site or its systems.</li>
        <li>Copy, scrape, or reproduce site content except as permitted below.</li>
        <li>Use the site for any unlawful or abusive purpose.</li>
      </ul>

      <h2>5. Inquiries and communications</h2>
      <p>
        When you submit our form, you consent to being contacted by email or WhatsApp about your
        inquiry and our programs. You can opt out at any time by emailing{" "}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <h2>6. Resources and the course syllabus</h2>
      <p>
        Resources we provide, including the BIM Foundation course syllabus, are for your personal,
        non-commercial reference. They remain the property of Nextudy and may not be redistributed,
        resold, or republished without our written permission.
      </p>

      <h2>7. No guarantee of outcomes</h2>
      <p>
        Nextudy provides education and mentorship. We do not guarantee employment, a specific salary,
        job placement, or any particular career outcome. Results depend on your effort, background, and
        factors outside our control. Any outcomes described on the site are illustrative, not promises.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The site and its content, including text, graphics, logos, the Nextudy name and mark, and
        course materials, are owned by Nextudy or its licensors and are protected by applicable
        intellectual property laws. You receive no ownership rights by using the site.
      </p>

      <h2>9. Third-party links and tools</h2>
      <p>
        The site may reference or link to third-party websites, software, and tools (for example,
        Autodesk Revit and Navisworks). Those are owned by their respective owners, and we are not
        responsible for their content, availability, or terms.
      </p>

      <h2>10. Disclaimer</h2>
      <p>
        The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        without warranties of any kind, whether express or implied, to the fullest extent permitted by
        law. We do not warrant that the site will be uninterrupted, error-free, or free of harmful
        components.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Nextudy will not be liable for any indirect,
        incidental, special, or consequential damages arising from your use of, or inability to use,
        the site or its resources.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of India, without regard to conflict-of-law principles.
        Any disputes will be subject to the exclusive jurisdiction of the competent courts in India.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes are posted
        means you accept the updated terms. The &ldquo;Last updated&rdquo; date above reflects the most
        recent revision.
      </p>

      <h2>14. Contact us</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
    </LegalLayout>
  );
}
