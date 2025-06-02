import React, { forwardRef } from 'react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'transition-all duration-200 ease-out focus:outline-none border rounded-xl'
  
  const variantClasses = {
    default: 'border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100',
    filled: 'border-transparent bg-slate-100 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100',
    outline: 'border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-5 py-4 text-lg min-h-[56px]'
  }
  
  const hasError = !!error
  const errorClasses = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${errorClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input 