import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-600 dark:text-gray-400`} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  )
}

export function LoadingSpinner({ size = "md", className = "" }: Omit<LoadingProps, "text">) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-600 dark:text-gray-400 ${className}`} />
  )
} 