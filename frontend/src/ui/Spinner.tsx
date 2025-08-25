import React from "react";

type SpinnerProps = { label?: string; size?: "sm" | "md" | "lg" };

const S = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-[4px]",
};

export const Spinner: React.FC<SpinnerProps> = ({ label, size = "md" }) => {
  const ring = S[size];
  return (
    <div className="inline-flex flex-col items-center gap-4">
      <div
        className={[
          "rounded-full animate-spin",
          "border-[var(--color-muted-foreground)] border-t-[var(--color-foreground)]",
          ring,
        ].join(" ")}
        style={{ animationDuration: "900ms" }}
      />
      {label ? (
        <div className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {label}
        </div>
      ) : null}
    </div>
  );
};
