import { useRef, useState } from "react";

type Props = { onFinish?: () => void };

export default function BanganzaIntro({ onFinish }: Props) {
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  function endWithFade() {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    // vänta tills mörka overlayn hunnit tona in (matchar duration-500)
    setTimeout(() => onFinish?.(), 600);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Banganza intro"
      className="fixed inset-0 z-[60] overflow-hidden bg-[#2a0d0d]"
    >
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/intropic.png"
        onEnded={endWithFade}
        onClick={endWithFade} /* klick för att hoppa över */
        className="w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
        Your browser does not support video :(
      </video>

      {/* mörk overlay som fadar in vid exit → undviker ljus flash */}
      <div
        className={[
          "pointer-events-none absolute inset-0 bg-[#2a0d0d]",
          "transition-opacity duration-500",
          exiting ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}
