"use client"

import React from "react"
import type { InputHTMLAttributes } from "react"
import { useState } from "react"
import { cn } from "../lib/utils"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked || false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      onChange?.(e)
    }

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input ref={ref} type="checkbox" checked={isChecked} onChange={handleChange} className="sr-only" {...props} />
          <div
            className={cn(
              "w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer",
              "flex items-center justify-center relative",
              isChecked ? "bg-primary border-primary shadow-soft" : "bg-surface border-border hover:border-primary/50",
              props.disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            onClick={() => !props.disabled && setIsChecked(!isChecked)}
          >
            {/* CSS Checkmark */}
            {isChecked && (
              <div className="w-3 h-3 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-1 border-b-2 border-l-2 border-base-100 transform rotate-[-45deg] translate-y-[-1px]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                className="text-sm font-medium text-foreground cursor-pointer leading-relaxed"
                onClick={() => !props.disabled && setIsChecked(!isChecked)}
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"
