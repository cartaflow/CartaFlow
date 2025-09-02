import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import type { Adapter } from "next-auth/adapters";

async function getClientInfo() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? "Unknown";
  const { browser, os, device } = UAParser(userAgent);

  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  return {
    userAgent,
    ipAddress: ipAddress.replace(/::ffff:/, ""),
    browser: `${browser.name ?? "Unknown"} ${browser.version ?? ""}`.trim(),
    os: `${os.name ?? "Unknown"} ${os.version ?? ""}`.trim(),
    device: device.type ?? "Desktop",
  };
}

export function TrackingPrismaAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,

    async createSession(session) {
      const clientInfo = await getClientInfo();
      return prisma.session.create({
        data: { ...session, ...clientInfo },
      });
    },
  };
}
