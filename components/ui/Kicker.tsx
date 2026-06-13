import { PlayMark } from "./icons";

// Meaningful section label (never "SECTION 01"). A short accent rule + the play
// mark from the brand logo, then the words.
export default function Kicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`eyebrow inline-flex items-center gap-2.5 text-accent ${className}`}>
      <PlayMark size={11} className="text-accent" />
      {children}
    </span>
  );
}
