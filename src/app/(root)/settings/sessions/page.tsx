import { getSessions } from "@/services/auth";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "@/components/settings/sessions-card";
import { Shield, Smartphone, Eye, RefreshCcw } from "lucide-react";
import { deleteAllOtherSessions } from "@/lib/actions/sessions";

export default async function SessionsPage() {
  const sessions = await getSessions();
  const sessionToken = (await cookies()).get("authjs.session-token");
  const t = await getTranslations("settings.sessions");
  const currentSessionToken = sessionToken?.value || "";
  const otherSessionsCount = sessions.filter(s => s.token !== currentSessionToken).length;

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">
          {t("description")}
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.token}
            session={session}
            isActive={session.token === currentSessionToken}
          />
        ))}
      </div>

      {otherSessionsCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              {t("sessionManagement")}
            </CardTitle>
            <CardDescription>
              {t("revokeAllDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={deleteAllOtherSessions}>
              <Button
                type="submit"
                variant="destructive"
                className="w-full"
              >
                {t("revokeAllButton", { count: otherSessionsCount })}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("securityTips")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm">{t("tip1")}</p>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm">{t("tip2")}</p>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCcw className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm">{t("tip3")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
