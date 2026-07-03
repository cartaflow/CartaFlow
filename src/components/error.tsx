import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RESOURCES, type Resource } from "@/constants/resources";

interface ErrorPageProps {
  error: Error & { code?: string; resource?: string };
}

export async function ErrorPage({ error }: ErrorPageProps) {
  const translations = {
    errors: await getTranslations("errors"),
    resources: await getTranslations("resources"),
    actions: await getTranslations("actions"),
  };

  const resourceKey = error.resource as Resource | undefined;
  const Icon = resourceKey ? RESOURCES[resourceKey].icon : AlertTriangle;
  const code = error.code ?? "unknown";
  const resourceName = resourceKey ? translations.resources(`${resourceKey}.singular`) : "";

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Icon className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{translations.errors(`${code}.title`)}</h1>
          <p className="text-muted-foreground">
            {translations.errors(`${code}.description`, { resource: resourceName })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {translations.actions("previousPage")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            <Home className="h-4 w-4" />
            {translations.actions("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
