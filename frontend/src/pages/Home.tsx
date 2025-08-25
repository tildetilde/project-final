import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Heading } from "../ui";
import { useLocation } from "react-router-dom";
import BanganzaIntro from "../components/BanganzaIntro";
import { CategorySelector } from "../components/CategorySelector";

export const Home = () => {
  const [introDone, setIntroDone] = useState<boolean>(
    () => sessionStorage.getItem("introDone") === "1"
  );
  const [showIntro, setShowIntro] = useState<boolean>(
    () => sessionStorage.getItem("introDone") !== "1"
  ); // ⬅️ nytt
  const FADE_MS = 600;
  const [ready, setReady] = useState(false);
  const catsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

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
      window.history.replaceState({}, ""); // rensa state så det inte triggas igen
    }
  }, [location.state, introDone]);

  const scrollToCategories = () => {
    catsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#2a0d0d] text-white relative">
      {/* INTROT: ligger överst och fadar ut när videon är klar */}
      {showIntro && (
        <BanganzaIntro
          onFinish={() => {
            // starta Home-fade-in
            setIntroDone(true);
            sessionStorage.setItem("introDone", "1");
            // vänta tills Home är synligt → SEN unmounta introt
            setTimeout(() => setShowIntro(false), FADE_MS);
          }}
        />
      )}

      {/* HOME: ligger under introt och fadar in */}
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
            className={`relative z-10 flex items-center justify-center min-h-screen transition-all duration-700 ${
              ready ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="text-center px-6">
              <p className="mb-6 tracking-[.25em] text-[10px] md:text-xs text-white/70">
                BEYOND THE ANSWERS… THERE IS
              </p>

              {/* Semantisk h1 för skärmläsare */}
              <h1 className="sr-only">Banganza</h1>

              {/* SVG-logga som visuellt ersätter rubriken */}
              <img
                src="/banganzalogo.svg"
                aria-hidden="true"
                className="mx-auto w-[min(82vw,900px)] h-auto text-[var(--color-base-400)]"
              />

              {/* 🔽 Diskret scroll-hint */}
              <button
                type="button"
                onClick={scrollToCategories}
                className="mt-10 text-white/70 hover:text-white transition-colors text-sm tracking-wide"
                aria-label="Scroll to categories"
              >
                See categories ↓
              </button>
            </div>
          </section>
        </main>

        {/* Kategorierna under (hintas genom negativ margin) */}
        <section
          ref={catsRef}
          className="bg-background text-foreground -mt-10 pt-12 pb-16"
        >
          <div className="mx-auto max-w-5xl px-4">
            <CategorySelector />
          </div>
        </section>
      </div>
    </div>
  );
};
