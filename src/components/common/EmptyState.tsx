import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white/75 p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-medical-sky text-medical-blue">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-bold text-medical-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
