import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 no-select ripple elevation-1 hover:elevation-2'
  
  const variantClasses = {
    primary: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white focus:ring-sky-500',
    secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 focus:ring-slate-400',
    outline: 'border-2 border-sky-500 text-sky-600 hover:bg-sky-50 active:bg-sky-100 focus:ring-sky-500',
    ghost: 'text-sky-600 hover:bg-sky-50 active:bg-sky-100 focus:ring-sky-500',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white focus:ring-emerald-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]'
  }
  
  const isDisabled = disabled || isLoading
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'touch-feedback'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${isLoading ? 'invisible' : ''}`}>
        {leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {children}
        
        {rightIcon && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </div>
    </button>
  )
} 