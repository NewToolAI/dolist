import React from 'react'
import { cn, designSystem } from '../../styles/designSystem'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Input: React.FC<InputProps> = ({
  size = 'medium',
  className,
  ...props
}) => {
  const inputClasses = cn(
    designSystem.input.base,
    designSystem.input.hover,
    size === 'small' && designSystem.input.small,
    size === 'medium' && designSystem.input.medium,
    size === 'large' && designSystem.input.large,
    className
  )

  return (
    <input
      className={inputClasses}
      {...props}
    />
  )
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  size = 'medium',
  className,
  ...props
}) => {
  const textareaClasses = cn(
    designSystem.input.base,
    designSystem.input.hover,
    size === 'small' && designSystem.input.small,
    size === 'medium' && designSystem.input.medium,
    size === 'large' && designSystem.input.large,
    'resize-none',
    className
  )

  return (
    <textarea
      className={textareaClasses}
      {...props}
    />
  )
}