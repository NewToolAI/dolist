import React from 'react'
import { cn, designSystem } from '../../styles/designSystem'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = cn(
    designSystem.button.base,
    designSystem.button.sizes[size],
    designSystem.button.variants[variant],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'blue' | 'red' | 'green'
  size?: 'small' | 'medium'
  children: React.ReactNode
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  className,
  ...props
}) => {
  let buttonClasses: string

  if (variant === 'default') {
    buttonClasses = size === 'small' 
      ? designSystem.button.icon.small 
      : designSystem.button.icon.medium
  } else {
    buttonClasses = designSystem.button.icon.colored[variant]
  }

  return (
    <button
      className={cn(buttonClasses, className)}
      {...props}
    >
      {children}
    </button>
  )
}