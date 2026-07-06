"use client";

import { LogOut, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  session: Session | null;
}

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppHeader({ session }: AppHeaderProps) {
  const nav = useTranslations("nav");
  const actions = useTranslations("actions");
  const { setTheme } = useTheme();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-base font-semibold tracking-tight">
            CartaFlow
          </Link>
          <Link href="/lists" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {nav("lists")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label={nav("toggleTheme")} className="relative" />}
            >
              <Sun className="rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 m-auto rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>{nav("light")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>{nav("dark")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>{nav("system")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label={nav("profile")}
                    className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/profile/${user.id}`} />}>
                  <User />
                  {nav("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                  <LogOut />
                  {actions("signout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/signin" />}>
              {actions("signin")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
