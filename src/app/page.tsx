import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const translations = await getTranslations("Home");

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{translations("title")}</h1>
            <p className="text-muted-foreground">{translations("description")}</p>
          </div>
          <Button render={<Link href="/lists" />}>{translations("cta")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
