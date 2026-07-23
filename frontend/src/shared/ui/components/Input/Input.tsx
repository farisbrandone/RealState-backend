import React, { InputHTMLAttributes } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-md border border-primary-200 bg-surface py-2.5 pr-4 text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-primary-50 disabled:text-primary-500 ${
              icon ? "pl-10" : "pl-4"
            } ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

/* import React, { InputHTMLAttributes } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-1">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-md border border-primary-200 bg-surface py-2.5 pl-${icon ? '10' : '4'} pr-4 text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-primary-50 disabled:text-primary-500 ${
              error ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
 */
