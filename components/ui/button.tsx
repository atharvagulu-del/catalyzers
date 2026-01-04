import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary text-primary-foreground hover:bg-primary-dark hover:scale-105 shadow-lg hover:shadow-xl":
                            variant === "default",
                        "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105":
                            variant === "secondary",
                        "border-2 border-primary text-primary hover:bg-primary hover:text-white":
                            variant === "outline",
                        "hover:bg-accent/10 hover:text-accent": variant === "ghost",
                    },
                    {
                        "h-10 px-6 py-2 text-base": size === "default",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-12 px-8 text-lg": size === "lg",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
