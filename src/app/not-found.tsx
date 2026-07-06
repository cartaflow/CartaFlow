import { Compass } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotFound() {
  const translations = await getTranslations("notFoundPage");
  const actions = await getTranslations("actions");

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <Compass className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold">{translations("title")}</h1>
            <p className="text-muted-foreground">{translations("description")}</p>
          </div>

          <Button render={<Link href="/" />}>{actions("backToHome")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
