import { useEffect, useState, useRef, useId } from "react";
import { useLocation } from "react-router-dom";
import BanganzaIntro from "../components/BanganzaIntro";
import { CategorySelector } from "../components/CategorySelector";

export const Home = () => {
  const [introDone, setIntroDone] = useState<boolean>(
    () => sessionStorage.getItem("introDone") === "1"
  );
  const [showIntro, setShowIntro] = useState<boolean>(
    () => sessionStorage.getItem("introDone") !== "1"
  );
  const FADE_MS = 100;
  const [ready, setReady] = useState(false);
  const catsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const [showInfo, setShowInfo] = useState(false);
  const infoTitleId = useId();
  const infoDescriptionId = `${infoTitleId}-desc`;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const s = (location.state as any) || {};
    if (s.scrollTo === "categories") {
      if (!introDone) {
        setIntroDone(true);
        sessionStorage.setItem("introDone", "1");
      }
      catsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState({}, "");
    }
  }, [location.state, introDone]);

  useEffect(() => {
    if (!showInfo) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInfo(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showInfo]);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="presentation"
    aria-hidden="true"
    className="h-5 w-5"
  >
    <rect
      x="11"
      y="10"
      width="2"
      height="7"
      rx="1"
      fill="currentColor"
    />
    <circle cx="12" cy="7" r="1.4" fill="currentColor" />
  </svg>
);


  return (
    <div className="min-h-screen bg-[#2a0d0d] text-white relative">
      {showIntro && (
        <BanganzaIntro
          onFinish={() => {
            setIntroDone(true);
            sessionStorage.setItem("introDone", "1");
            setTimeout(() => setShowIntro(false), FADE_MS);
          }}
        />
      )}

{!showIntro && (
  <button
    type="button"
    onClick={() => setShowInfo(true)}
    className="fixed z-40 top-4 left-4 sm:top-6 sm:left-6
               flex h-10 w-10 items-center justify-center
               rounded-full border border-white/40 bg-white/5 text-white/90
               backdrop-blur shadow-soft transition
               hover:bg-white/10
               focus-visible:outline focus-visible:outline-2
               focus-visible:outline-offset-2 focus-visible:outline-white/80"
    aria-label="Show game info"
  >
    <InfoIcon />
  </button>
)}

      <div
        aria-hidden={!introDone}
        className={`transition-opacity duration-[${FADE_MS}ms] ${
          introDone ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <main className="min-h-screen relative overflow-hidden bg-[#2a0d0d] text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-1/3 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-16 bottom-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          </div>

          <section
            className={`relative z-0 flex items-center justify-center min-h-[90vh] pb-16 md:pb-24 transition-all duration-700 ${
              ready ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="text-center px-6">
              <p className="[font-family:var(--font-family-sans)] mb-16 tracking-[.25em] text-[10px] md:text-xs text-white/70">
                BEYOND THE ANSWERS… THERE IS
              </p>

              <h1 className="sr-only">Banganza</h1>

              <img
                src="/banganzalogo.svg"
                alt="Banganza logo"
                aria-hidden="true"
                className="mx-auto w-[min(95vw,1800px)] h-auto text-[var(--color-base-400)]"
              />
            </div>
          </section>
        </main>

        <section
          ref={catsRef}
          className="relative z-20 bg-background text-foreground
              -mt-25 md:-mt-30 rounded-t-3xl pt-10 md:pt-12 pb-16
              shadow-[0_-16px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="mx-auto max-w-5xl px-4">
            <CategorySelector />
          </div>
        </section>
      </div>

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={infoTitleId}
            aria-describedby={infoDescriptionId}
            className="relative z-10 w-full max-w-xl rounded-[2rem] border border-foreground/10 bg-background text-foreground shadow-strong   px-6 py-5 sm:px-10 sm:py-7
             space-y-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p
                  id={infoTitleId}
                  className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]"
                >
                  Game info
                </p>
                <p
                  id={infoDescriptionId}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  The goal of the game is to place 10 cards correctly according
                  to the rule for the chosen category.
                </p>
              </div>
<button
  type="button"
  onClick={() => setShowInfo(false)}
  className="flex h-10 w-10 items-center justify-center rounded-full
             border border-foreground/15 bg-background text-foreground
             shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-sm
             transition hover:bg-foreground/5 active:scale-95
             focus-visible:outline focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-primary/60"
  aria-label="Close game info"
>
  <span aria-hidden="true" className="text-xl leading-none -mt-[1px]">
    ×
  </span>
</button>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  Setup
                </p>
                <ul className="list-disc space-y-1.5 pl-4 marker:text-primary">
                  <li>
                    <span className="font-semibold text-foreground">
                      Choose a category.
                    </span>{" "}
                    The category decides what you are comparing, for example
                    earlier vs later in time, lighter vs heavier, shorter vs
                    longer, or smaller vs larger values.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">
                      Form your teams.
                    </span>{" "}
                    2–4 teams, any number of players. Each team gets one
                    starting card that begins their line.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">
                      Pick turn time.
                    </span>{" "}
                    Decide whether each turn should be 30, 60, or 90 seconds.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  Your turn
                </p>
                <ol className="space-y-1.5 pl-5 list-decimal">
                  <li>Draw the next card.</li>
                  <li>
                    Decide where it belongs on your team’s line based on the
                    category rule.
                  </li>
                  <li>Place the card and confirm your choice.</li>
                </ol>
                <p>
                  <span className="font-semibold text-foreground">Correct:</span>{" "}
                  The card stays on the line.{" "}
                  <span className="font-semibold text-foreground">
                    Incorrect:
                  </span>{" "}
                  The card is discarded.
                </p>
              </section>

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  End of round
                </p>
                <p>
                  The first team with{" "}
                  <span className="font-semibold text-foreground">
                    10 correct cards
                  </span>{" "}
                  on their line wins the round.
                </p>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
