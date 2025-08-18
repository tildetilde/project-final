import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Heading } from "../ui";
import BanganzaIntro from "../components/BanganzaIntro";

export const Home = () => {
  const [introDone, setIntroDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {!introDone && <BanganzaIntro onFinish={() => setIntroDone(true)} />}

      <div
        aria-hidden={!introDone}
        className={`transition-opacity duration-500 ${
          introDone ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <main className="min-h-screen relative overflow-hidden bg-accent-800 text-base-100">
          {/* mjuka glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-1/4 w-72 h-72 rounded-full bg-accent-400/20 blur-3xl" />
            <div className="absolute -right-10 bottom-1/5 w-96 h-96 rounded-full bg-accent-200/20 blur-3xl" />
          </div>

          <section
            className={`relative z-10 flex items-center justify-center min-h-screen transition-all duration-700 ${
              ready ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="w-full max-w-6xl mx-auto px-6 text-center">
              <p className="mb-6 tracking-[.25em] text-[10px] md:text-xs text-base-100/70 animate-[tagline-in_1s_ease-out]">
                WHEN THE BANGERS ARE TOO GOOD… YOU JUST NEED TO
              </p>

              <Heading
                level={1}
                className="font-black tracking-wider text-base-100 text-[16vw] leading-[0.9] md:text-9xl animate-[logo-in_1s_ease-out]"
              >
                BANGANZA
              </Heading>

              <div className="mt-10 flex items-center justify-center">
                <Link to="/gamemode">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full px-10 py-6 text-xl"
                  >
                    Start Game
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
