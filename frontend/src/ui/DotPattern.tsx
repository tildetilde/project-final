import React from "react";
import { cn } from "../lib/utils";

interface DotPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "square" | "diamond" | "cluster" | "diagonal";
  size?: "sm" | "md" | "lg";
}

export const DotPattern = React.forwardRef<HTMLDivElement, DotPatternProps>(
  ({ className, variant = "square", size = "md", ...props }, ref) => {
    const dotSizes = {
      sm: "w-1.5 h-1.5",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    const patterns = {
      square: (
        <div className="grid grid-cols-2 gap-3">
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
        </div>
      ),
      diamond: (
        <div className="flex flex-col items-center space-y-2">
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          <div className="flex space-x-4">
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          </div>
          <div className={cn("rounded-full bg-primary", dotSizes[size])} />
        </div>
      ),
      cluster: (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-2">
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          </div>
          <div className="flex space-x-2">
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
            <div className={cn("rounded-full bg-primary", dotSizes[size])} />
          </div>
        </div>
      ),
      diagonal: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div
            className={cn(
              "rounded-full bg-primary absolute top-1 right-2",
              dotSizes[size]
            )}
          />
          <div
            className={cn(
              "rounded-full bg-primary absolute top-4 left-1",
              dotSizes[size]
            )}
          />
          <div
            className={cn(
              "rounded-full bg-primary absolute bottom-4 right-1",
              dotSizes[size]
            )}
          />
          <div
            className={cn(
              "rounded-full bg-primary absolute bottom-1 left-2",
              dotSizes[size]
            )}
          />
        </div>
      ),
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center py-4", className)}
        {...props}
      >
        {patterns[variant]}
      </div>
    );
  }
);

DotPattern.displayName = "DotPattern";
