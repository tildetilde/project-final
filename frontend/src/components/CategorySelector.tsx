import React, { useEffect } from "react";
import { useGame } from "../store/game";
import { Spinner } from "../ui/Spinner";
import { useNavigate } from "react-router-dom";

const AnimalIcon = () => (
<svg width="64" height="36" viewBox="0 0 64 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="22" cy="12" r="3" fill="currentColor"/>
  <circle cx="29" cy="9"  r="3" fill="currentColor"/>
  <circle cx="35" cy="9"  r="3" fill="currentColor"/>
  <circle cx="42" cy="12" r="3" fill="currentColor"/>
  <ellipse cx="32" cy="23" rx="10" ry="7" fill="currentColor"/>
</svg>
);



const PersonIcon = () => (
  <svg width="64" height="36" viewBox="0 0 64 36" aria-hidden="true">
    <circle cx="32" cy="12" r="7" fill="var(--color-foreground)" />
    <rect x="16" y="22" width="32" height="10" rx="5" fill="var(--color-foreground)" opacity="0.35" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="64" height="36" viewBox="0 0 64 36" aria-hidden="true">
    <defs>
      <clipPath id="globeClip">
        <circle cx="32" cy="18" r="13" />
      </clipPath>
    </defs>
    <circle cx="32" cy="18" r="13" fill="none" stroke="var(--color-foreground)" strokeWidth="2" />
    <g clipPath="url(#globeClip)" stroke="var(--color-foreground)" fill="none">
      <line x1="19" y1="18" x2="45" y2="18" strokeWidth="2" opacity=".45" />
      <line x1="20" y1="12" x2="44" y2="12" strokeWidth="1.6" opacity=".35" />
      <line x1="20" y1="24" x2="44" y2="24" strokeWidth="1.6" opacity=".35" />
      <path d="M26,6 C20,12 20,24 26,30" strokeWidth="1.6" opacity=".45" />
      <path d="M38,6 C44,12 44,24 38,30" strokeWidth="1.6" opacity=".45" />
    </g>
  </svg>
);

export const CategorySelector: React.FC = () => {
  const { categories, loading, error, loadCategories, selectCategory, selectedCategory } = useGame();
  const navigate = useNavigate();

  useEffect(() => { loadCategories(); }, [loadCategories]);

  if (loading) return (
    <div className="flex justify-center items-center p-16">
      <Spinner label="Loading categories..." />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-red-600 text-lg">Error: {error}</div>
    </div>
  );

  const iconFor = (id: string) => {
    if (id.startsWith("animals")) return <AnimalIcon />;
    if (id.startsWith("celebrities")) return <PersonIcon />;
    return <GlobeIcon />;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Choose a Category</h2>
        <p className="text-muted-foreground">Pick one to start playing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const active = selectedCategory?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { selectCategory(c); navigate("/gamemode"); }}
              className={`report-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${active ? "report-card--active" : ""}`}
              aria-pressed={active}
            >
              <div className="flex flex-col items-center justify-center gap-5 text-center px-8">
                {iconFor(c.id)}
                <h3 className="uppercase font-semibold text-foreground/90 text-[clamp(0.9rem,2.5vw,1.1rem)] leading-snug">
                  {c.question}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
