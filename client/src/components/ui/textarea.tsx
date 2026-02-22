import { cn } from "@/lib/utils"
import * as React from "react"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Flat, clean base — no glassmorphism, no CSS variable backgrounds
        "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700",
        "placeholder:text-gray-400",
        // Resize: vertical only so user can expand but not break layout
        "resize-y",
        // Focus styling
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        // Scrollbar
        "scrollbar-thin",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

