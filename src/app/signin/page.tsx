import { signIn } from "@/services/auth";
import { getAvailableProviders } from "@/services/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { GitHubIcon, GoogleIcon, MicrosoftIcon } from "@/components/provider-icons";

function getProviderIcon(icon: string) {
  switch (icon) {
    case "github":
      return <GitHubIcon className="size-5" />;
    case "google":
      return <GoogleIcon className="size-5" />;
    case "microsoft":
      return <MicrosoftIcon className="size-5" />;
    default:
      return null;
  }
}

function getProviderClassName(icon: string) {
  switch (icon) {
    case "github":
      return "border-border hover:border-primary/20 hover:bg-muted/50 text-foreground";
    case "google":
      return "border-border hover:border-primary/20 hover:bg-muted/50 text-foreground";
    case "microsoft":
      return "border-border hover:border-primary/20 hover:bg-muted/50 text-foreground";
    default:
      return "border-border hover:border-primary/20 hover:bg-muted/50";
  }
}

export default function LoginPage() {
  const providers = getAvailableProviders();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenue</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte CartaFlow</p>
        </div>

        <Card className="shadow-xl border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {providers.length > 0 ? (
              <>
                {providers.map((provider) => (
                  <form
                    key={provider.id}
                    action={async () => {
                      "use server";
                      await signIn(provider.id, { redirectTo: "/" });
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      className={`w-full cursor-pointer flex items-center h-12 justify-center gap-1.5 font-medium transition-all duration-200 ${getProviderClassName(provider.icon)}`}
                    >
                      {getProviderIcon(provider.icon)}
                      Continuer avec {provider.name}
                    </Button>
                  </form>
                ))}

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">ou</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Configuration requise</h3>
                <p className="text-muted-foreground mb-2">Aucun fournisseur d&apos;authentification configuré.</p>
                <p className="text-sm text-muted-foreground/70">
                  Veuillez configurer au moins un fournisseur dans les variables d&apos;environnement.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
            <ArrowLeftIcon className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
