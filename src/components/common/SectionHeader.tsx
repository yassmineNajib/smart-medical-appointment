export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold text-medical-navy sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-700">{description}</p> : null}
    </div>
  );
}
