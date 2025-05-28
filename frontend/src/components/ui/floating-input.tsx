
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(e.target.value !== '');
    };

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer w-full px-4 pt-6 pb-2 text-base bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg",
            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "transition-all duration-300 placeholder-transparent",
            "hover:bg-white/10 hover:border-white/30",
            className
          )}
          placeholder={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none",
            "text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4",
            "peer-focus:text-xs peer-focus:top-2 peer-focus:text-blue-400",
            (focused || hasValue) ? "text-xs top-2 text-blue-400" : "text-base top-4"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
