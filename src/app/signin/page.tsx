import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { providerOptions } from "@/constants/providers";
import { signIn } from "@/services/auth";

export default async function SignInPage() {
  const translations = await getTranslations("signin");

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-xs">
        <CardContent className="space-y-3">
          <h1 className="text-xl font-bold text-center mb-2">{translations("title")}</h1>

          {providerOptions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">{translations("noProviders")}</p>
          )}

          {providerOptions.map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                await signIn(provider.id);
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                {translations("signInWith", { provider: provider.name })}
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
