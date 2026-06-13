import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nextudy collects, uses, and protects the information you share through our website and inquiry form.",
};

const UPDATED = "June 13, 2026";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro="This policy explains what information Nextudy collects when you use our website, how we use it, and the choices you have. We keep it deliberately plain."
    >
      <h2>1. Who we are</h2>
      <p>
        Nextudy (&ldquo;Nextudy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a mentor-led BIM and
        AEC upskilling provider operating the website at nextudyeducation.com. If you have any
        questions about this policy or your data, contact us at{" "}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        <strong>Information you give us.</strong> When you submit our inquiry form, we collect the
        details you provide: whether you are an individual or a business, your name or company name,
        your email address, your WhatsApp number, the program or service you are interested in, and
        any message you choose to add. The message field is optional.
      </p>
      <p>
        <strong>Information collected automatically.</strong> Like most websites, we may collect
        basic technical information through your browser, such as device and browser type, approximate
        location derived from your IP address, the pages you view, and the date and time of your visit.
        This is used in aggregate to understand how the site is used.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To respond to your inquiry and arrange a callback or conversation with a mentor.</li>
        <li>To deliver the resources you request, such as the BIM Foundation course syllabus.</li>
        <li>To share relevant information about our programs, schedules, and offers.</li>
        <li>To operate, maintain, and improve our website and services.</li>
        <li>To comply with legal obligations and protect against misuse.</li>
      </ul>

      <h2>4. Communications</h2>
      <p>
        By submitting the form, you agree that we may contact you by email or WhatsApp regarding your
        inquiry and our programs. You can ask us to stop contacting you at any time by replying to any
        message or emailing <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <h2>5. How we share information</h2>
      <p>
        We do not sell your personal information. We may share it with trusted service providers who
        help us operate (for example, email, hosting, messaging, and analytics providers), and only to
        the extent needed to perform those services. We may also disclose information if required by
        law or to protect our rights and the safety of others.
      </p>

      <h2>6. Cookies and analytics</h2>
      <p>
        We may use cookies and similar technologies, including analytics tools, to understand site
        usage and improve the experience. You can control cookies through your browser settings.
        Disabling cookies may affect some features of the site.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We keep your information for as long as needed to respond to your inquiry, provide our
        services, and meet our legal and operational requirements. When it is no longer needed, we
        remove or anonymize it.
      </p>

      <h2>8. Your choices and rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, or delete the personal
        information we hold about you, and to object to or restrict certain uses. To exercise any of
        these rights, email us at <a href={`mailto:${brand.email}`}>{brand.email}</a> and we will
        respond within a reasonable time.
      </p>

      <h2>9. Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your information. No method
        of transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>10. Children&rsquo;s privacy</h2>
      <p>
        Our services are intended for students, graduates, and working professionals. The site is not
        directed at children under 16, and we do not knowingly collect their personal information.
      </p>

      <h2>11. Third-party links</h2>
      <p>
        Our site may link to third-party websites and tools. We are not responsible for their privacy
        practices, and we encourage you to read their policies.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise the &ldquo;Last
        updated&rdquo; date above. Significant changes will be made clear on this page.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about this policy or your information? Email{" "}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
    </LegalLayout>
  );
}
