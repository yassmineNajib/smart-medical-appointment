import type * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("grid rounded-xl border border-[#DED8CD]/70 bg-[#F6F1E7]/70 p-1 shadow-sm backdrop-blur", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition duration-200 hover:text-medical-navy data-[state=active]:bg-medical-navy data-[state=active]:text-white data-[state=active]:shadow-[0_12px_24px_rgba(7,26,43,0.18)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("mt-4 animate-fade-up focus:outline-none", className)} {...props} />;
}
