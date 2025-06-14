
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, XCircle, Loader2 } from "lucide-react";

interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const feedbackConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  },
  loading: {
    icon: Loader2,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-600'
  }
};

const sizeConfig = {
  sm: {
    container: 'p-3',
    icon: 'h-4 w-4',
    title: 'text-sm font-medium',
    message: 'text-sm'
  },
  md: {
    container: 'p-4',
    icon: 'h-5 w-5',
    title: 'text-base font-medium',
    message: 'text-sm'
  },
  lg: {
    container: 'p-6',
    icon: 'h-6 w-6',
    title: 'text-lg font-medium',
    message: 'text-base'
  }
};

export function Feedback({ 
  type, 
  title, 
  message, 
  className, 
  showIcon = true, 
  size = 'md' 
}: FeedbackProps) {
  const config = feedbackConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div className={cn(
      "border rounded-lg",
      config.bgColor,
      config.borderColor,
      sizes.container,
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon 
            className={cn(
              sizes.icon,
              config.iconColor,
              type === 'loading' && 'animate-spin',
              'mt-0.5 flex-shrink-0'
            )}
          />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn(sizes.title, config.textColor, 'mb-1')}>
              {title}
            </p>
          )}
          <p className={cn(sizes.message, config.textColor)}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
