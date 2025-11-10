/**
 * Shared UI Component: Input
 */
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/src/shared/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type = "text", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
          className
        )}
        {...props}
      />
    </div>
  )
);

Input.displayName = "Input";
