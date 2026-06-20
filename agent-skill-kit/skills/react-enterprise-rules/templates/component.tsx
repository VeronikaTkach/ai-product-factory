import type { ReactNode } from "react";

interface IComponentNameProps {
  title: string;
  children?: ReactNode;
}

export function ComponentName({ title, children }: IComponentNameProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children ? <div className="text-sm text-muted-foreground">{children}</div> : null}
    </section>
  );
}
