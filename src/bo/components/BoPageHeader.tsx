import React from 'react';
import { ChevronRight } from 'lucide-react';

type BoPageHeaderProps = {
  title: string;
  breadcrumbs?: string[];
  action?: React.ReactNode;
};

export default function BoPageHeader({ title, breadcrumbs, action }: BoPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-black lg:text-3xl">{title}</h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-1 text-sm text-bo-muted">
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={14} className="shrink-0 opacity-50" />}
                <span className={i === breadcrumbs.length - 1 ? 'font-semibold text-bo-secondary' : ''}>{c}</span>
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
