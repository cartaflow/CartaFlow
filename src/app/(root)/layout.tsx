import { ReactNode } from "react";
import React from "react";
import { Header } from "@/components/header";
import { auth } from "@/services/auth";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user || null;

  return (
    <main>
      <Header user={user} />
      {children}
    </main>
  );
}
