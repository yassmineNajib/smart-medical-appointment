import type * as React from "react";
import { cn } from "../../lib/utils";

export function AnimatedSection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("animate-fade-up", className)} {...props}>
      {children}
    </section>
  );
}
