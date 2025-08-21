import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Heading } from "../ui";
import BanganzaIntro from "../components/BanganzaIntro";
import { CategorySelector } from "../components/CategorySelector";

export const Home = () => {
  const [introDone, setIntroDone] = useState(false);
  const [ready, setReady] = useState(false);
  const catsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  const scrollToCategories = () => {
    catsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <div className="min-h-screen">
      {!introDone && <BanganzaIntro onFinish={() => setIntroDone(true)} />}

      <div
        aria-hidden={!introDone}
        className={`transition-opacity duration-500 ${
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
                WHEN THE BANGERS ARE TOO GOOD… YOU JUST NEED TO
              </p>
              <Heading
                level={1}
                className="text-5xl md:text-7xl font-black tracking-wider"
              >
                BANGANZA
              </Heading>

 {/* 🔽 Diskret scroll-hint i stället för Start Game */}
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
