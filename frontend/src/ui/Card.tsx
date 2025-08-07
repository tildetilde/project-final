import React from "react";
import { cn } from "../lib/utils";

type CardVariant = "surface" | "accent";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  clickable?: boolean  
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "surface", hoverable = false, clickable = false, ...props }, ref) => {
        const hoverClasses = hoverable
      ? "hover:shadow-medium hover:border-primary/30 hover:bg-card hover:-translate-y-1"
      : "";
       const clickClasses = clickable ? "cursor-pointer" : "";
      
       const variantClasses =
      variant === "accent"
        ? "bg-accent-300 border-accent-400 text-base-100 hover:bg-accent-200"
        : "bg-surface border-border text-foreground";
       
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl bg-surface border border-primary/20 p-8 transition-all duration-300",
          variantClasses,
          hoverClasses,
          clickClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center space-y-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("text-center", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";
