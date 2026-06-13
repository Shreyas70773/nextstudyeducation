import Image from "next/image";

const MARK = 675 / 619; // intrinsic aspect of the cropped nx mark
const WORD = 1297 / 337; // intrinsic aspect of the cropped wordmark

// Brand lockup from the real assets (transparent orange variants for dark UI).
export default function Logo({
  variant = "full",
  height = 28,
  className = "",
  priority = false,
}: {
  variant?: "full" | "mark" | "word";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const wordH = Math.round(height * 0.72);
  const mark = (
    <Image
      src="/brand/mark.png"
      alt="Nextudy"
      height={height}
      width={Math.round(height * MARK)}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );
  const word = (
    <Image
      src="/brand/wordmark.png"
      alt="Nextudy"
      height={wordH}
      width={Math.round(wordH * WORD)}
      priority={priority}
      style={{ height: wordH, width: "auto" }}
    />
  );

  if (variant === "mark")
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
  if (variant === "word")
    return <span className={`inline-flex items-center ${className}`}>{word}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {word}
    </span>
  );
}
