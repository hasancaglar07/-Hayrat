import clsx from "clsx";

export type LongFormSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export function LongFormArticle({
  kicker,
  title,
  description,
  updatedAt,
  sections,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  updatedAt?: string;
  sections: LongFormSection[];
  className?: string;
}) {
  return (
    <article className={clsx("panel space-y-8 p-6 md:p-8", className)}>
      <header className="space-y-3">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="page-title">{title}</h1>
        {description ? <p className="text-text-medium">{description}</p> : null}
        {updatedAt ? <p className="text-micro text-text-light">{updatedAt}</p> : null}
      </header>

      <div className="space-y-7">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="section-title-sm">{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="text-text-medium leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-text-medium">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
