import React from "react"
import { cn } from "../lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 text-base bg-surface border-2 rounded-xl transition-all duration-200",
            "placeholder:text-muted-foreground text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/50"
              : "border-border hover:border-primary/50",
            className,
          )}
          {...props}
        />
        {helperText && (
          <p className={cn("mt-2 text-sm", error ? "text-red-600" : "text-muted-foreground")}>{helperText}</p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"
