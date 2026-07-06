import Link from "next/link";
import { cn } from "@/lib/utils";

function BackLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("text-sm text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      {children}
    </Link>
  );
}

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, subtitle, backHref, backLabel, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {backHref && (
        <BackLink href={backHref} className="mb-4 inline-block">
          {backLabel}
        </BackLink>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance">{title}</h1>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export { PageHeader, BackLink };
