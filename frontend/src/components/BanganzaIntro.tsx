import { useEffect, useState } from "react";
import logoUrl from "../assets/banganzalogo.svg";
import bananaUrl from "../assets/banana.png"; // byt till rätt bana-fil

type Props = { onFinish?: () => void };

export default function BanganzaIntro({ onFinish }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    // auto-exit efter 3.5s
    timers.push(window.setTimeout(() => exit(), 3500));
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  function exit() {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onFinish?.(), 400);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Banganza intro"
      onPointerDown={exit}
      className={[
        "fixed inset-0 z-[60] flex items-center justify-center overflow-hidden",
        "bg-[var(--color-base-400)]",
        exiting ? "opacity-0 transition-opacity duration-300" : "opacity-100",
      ].join(" ")}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        {Array.from({ length: 12 }).map((_, i) => {
          const left = `${(i * 13) % 100}%`; // slumpmässig horisontell spridning
          const delay = `${i * 150}ms`;
          const size =
            i % 3 === 0 ? "w-12 h-12" : i % 3 === 1 ? "w-10 h-10" : "w-8 h-8";
          const rot = i % 2 === 0 ? "rotate-[14deg]" : "-rotate-[12deg]";
          return (
            <img
              key={i}
              src={bananaUrl}
              alt=""
              style={{ left, animationDelay: delay }}
              className={[
                "absolute top-[-10%] object-contain opacity-80",
                size,
                rot,
                "animate-[banana-fly_4000ms_linear_infinite]",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Logga med inzoom och duns */}
      <img
        src={logoUrl}
        alt="Banganza"
        draggable={false}
        className="w-[60%] max-w-4xl animate-[logo-bounce-in_2400ms_cubic-bezier(.25,1.5,.5,1)_forwards]"
      />
    </div>
  );
}
