"use client"

import type React from "react"
import { cn } from "../lib/utils"

type ErrorVariant = "error" | "warning" | "info"

interface ErrorMessageProps {
  message: string
  variant?: ErrorVariant
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = "error",
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variantClasses = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconClasses = {
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  }

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-xl border-2 shadow-soft",
        variantClasses[variant],
        className,
      )}
      role="alert"
    >
      {/* CSS Alert Icon */}
      <div className={cn("w-5 h-5 flex-shrink-0 mt-0.5 relative", iconClasses[variant])}>
        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
          <div className="w-0.5 h-2 bg-current rounded-full mb-0.5" />
          <div className="w-0.5 h-0.5 bg-current rounded-full absolute bottom-1" />
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            "flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors duration-200 w-6 h-6 flex items-center justify-center",
            iconClasses[variant],
          )}
          aria-label="Dismiss message"
        >
          {/* CSS X Icon */}
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-current transform rotate-45" />
              <div className="w-3 h-0.5 bg-current transform -rotate-45 absolute" />
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
