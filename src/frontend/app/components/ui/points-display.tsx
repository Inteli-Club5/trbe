import { ReactNode } from "react"

interface PointsDisplayProps {
  points: number
  className?: string
  showSign?: boolean
  children?: ReactNode
}

export function PointsDisplay({ points, className = "", showSign = true, children }: PointsDisplayProps) {
  const isPositive = points >= 0
  const colorClass = isPositive 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400"
  
  const sign = showSign ? (isPositive ? "+" : "") : ""
  
  return (
    <span className={`${colorClass} ${className}`}>
      {sign}{points.toLocaleString()}
      {children}
    </span>
  )
} 