import { cn } from "@/lib/utils"

interface ProgressDotsProps {
  total: number
  currentIndex: number
}

export function ProgressDots({ total, currentIndex }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-colors duration-200",
            i === currentIndex
              ? "bg-foreground"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  )
}