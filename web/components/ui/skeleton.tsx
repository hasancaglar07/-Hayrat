import clsx from "clsx";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("skeleton", className)} aria-hidden="true" {...props} />;
}

