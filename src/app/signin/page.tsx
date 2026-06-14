import { signIn, getAvailableProviders } from "@/services/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangleIcon, ArrowLeftIcon, LockIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

const LoginPage = async () => {
  const providers = getAvailableProviders();
  const t = await getTranslations("signin");

  return (
    <div className="sm:min-h-screen h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 border bg-card rounded-xl flex items-center justify-center mb-4 text-primary">
            <LockIcon className="size-6" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card className="shadow-xl sm:border py-1 sm:py-6 border-0 sm:bg-card/50 bg-background backdrop-blur-sm">
          <CardContent className="sm:p-6 p-0">
            {providers.length > 0 ? (
              <div className="space-y-4">
                {providers.map((provider) => (
                  <form key={provider.id} action={async () => {
                    "use server";
                    await signIn(provider.id, { redirectTo: "/" });
                  }}>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full h-12 gap-3 cursor-pointer border-border hover:border-primary/20 hover:bg-muted/50 text-foreground font-medium transition-all duration-200"
                    >
                      {<provider.icon className="size-5" />}
                      {t("continueWith", { provider: provider.name })}
                    </Button>
                  </form>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangleIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("noProviders.title")}</h3>
                  <p className="text-muted-foreground mb-1">{t("noProviders.description")}</p>
                  <p className="text-sm text-muted-foreground/70">
                    {t("noProviders.help")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            <ArrowLeftIcon className="w-4 h-4" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
