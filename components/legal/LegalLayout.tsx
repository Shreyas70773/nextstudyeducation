import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/Footer";
import { ArrowRight } from "@/components/ui/icons";

// Shared chrome for long-form legal pages: a quiet header (logo + back to site),
// the content, and the standard site footer. Calm, readable, on-brand.
export default function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="relative z-10 border-b border-line/60 bg-ink">
        <div className="shell flex items-center justify-between py-5">
          <Link href="/" aria-label="Nextudy home" className="inline-flex">
            <Logo height={26} priority />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-mute transition-colors duration-200 hover:text-bone"
          >
            <ArrowRight
              size={16}
              className="rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            />
            Back to site
          </Link>
        </div>
      </header>

      <main className="relative">
        <div className="bloom left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 opacity-20" aria-hidden="true" />
        <div className="shell relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-accent">Legal</p>
            <h1 className="display mt-4 text-[clamp(2.1rem,5vw,3.4rem)] text-bone">{title}</h1>
            <p className="mt-4 text-sm text-faint">Last updated {updated}</p>
            {intro ? (
              <p className="mt-6 max-w-[72ch] text-lg leading-relaxed text-mute">{intro}</p>
            ) : null}
            <div className="hairline mt-10" />
            <div className="legal-prose mt-10">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
