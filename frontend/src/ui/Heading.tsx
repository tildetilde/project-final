import React from "react";
import { cn } from "../lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, children, ...props }, ref) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const styles = {
      1: "text-6xl font-bold text-primary tracking-tight",
      2: "text-4xl font-bold text-primary tracking-tight",
      3: "text-2xl font-semibold text-primary tracking-tight",
      4: "text-xl font-semibold text-foreground",
      5: "text-lg font-medium text-foreground",
      6: "text-base font-medium text-muted-foreground",
    };

    return React.createElement(
      Tag,
      {
        ref,
        className: cn(styles[level], className),
        ...props,
      },
      children
    );
  }
);

Heading.displayName = "Heading";
