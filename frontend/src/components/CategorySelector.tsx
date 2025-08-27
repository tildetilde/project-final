import React, { useEffect } from "react";
import { useGame } from "../store/game";
import { Spinner } from "../ui/Spinner";
import { useNavigate } from "react-router-dom";

const AnimalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" />
    <path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" />
    <path d="M18 11v.01" />
    <path d="M11.5 10.5c-.667 1 -.667 2 0 3" />
  </svg>
);

const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 4h-2l-3 10" />
    <path d="M16 4h2l3 10" />
    <path d="M10 16h4" />
    <path d="M21 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" />
    <path d="M10 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" />
    <path d="M4 14l4.5 4.5" />
    <path d="M15 14l4.5 4.5" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5" />
    <path d="M9 4v13" />
    <path d="M15 7v5.5" />
    <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
    <path d="M19 18v.01" />
  </svg>
);

export const CategorySelector: React.FC = () => {
  const {
    categories,
    loading,
    error,
    loadCategories,
    selectCategory,
    selectedCategory,
  } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading)
    return (
      <div className="flex justify-center items-center p-16">
        <Spinner label="Loading categories..." />
      </div>
    );

  if (error)
    return (
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 [font-family:var(--font-family-sans)]">
          THE CATEGORIES
        </h2>
        <p className="text-muted-foreground [font-family:var(--font-family-mono)]">
          Pick one to start playing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const active = selectedCategory?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                selectCategory(c);
                navigate("/gamemode");
              }}
              className={`[font-family:var(--font-family-mono)] report-card font-[var(--font-family-mono)] group focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-primary ${
                active ? "report-card--active" : ""
              }`}
              aria-pressed={active}
            >
              <div className="flex flex-col items-center justify-center gap-5 text-center px-8">
                {iconFor(c.id)}
                <h3 className="uppercase font-semibold text-foreground/90 text-[clamp(0.9rem,2.5vw,1.1rem)] leading-snug [text-wrap:balance]">
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
