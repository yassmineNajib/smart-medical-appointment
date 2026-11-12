import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-teal disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(21,111,145,0.22)] hover:-translate-y-0.5 hover:bg-medical-navy hover:shadow-[0_18px_38px_rgba(15,23,42,0.18)]",
        secondary: "border border-[#DED8CD] bg-[#FCFAF4] text-medical-navy shadow-sm hover:-translate-y-0.5 hover:border-champagne hover:bg-[#F6F1E7]",
        ghost: "text-medical-navy hover:bg-muted",
        danger: "bg-danger text-white shadow-[0_14px_30px_rgba(193,49,57,0.22)] hover:-translate-y-0.5 hover:brightness-95",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);

Button.displayName = "Button";
