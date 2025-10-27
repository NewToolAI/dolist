import React from 'react'
import { cn, designSystem } from '../../styles/designSystem'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  interactive?: boolean
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  hover = false,
  interactive = false,
  children,
  className,
  ...props
}) => {
  const cardClasses = cn(
    designSystem.card.base,
    hover && designSystem.card.hover,
    interactive && designSystem.card.interactive,
    className
  )

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}