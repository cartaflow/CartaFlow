"use client";
import React, { useState, useEffect } from "react";
import { Menu, UserRound, X, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Header: React.FC<{ user: User | null }> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("header");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element)?.closest("header")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const avatarUrl = user?.image && user.image.trim() !== "" ? user.image : null;

  return (
    <>
      <header className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-primary">
              CartaFlow
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/lists" className="text-sm font-semibold hover:text-primary transition-colors">
                {t("lists")}
              </Link>
              <Link href="/explore" className="text-sm font-semibold hover:text-primary transition-colors">
                {t("explore")}
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                        {avatarUrl ? (
                          <Image src={avatarUrl} alt={user.name || "User"} width={32} height={32} className="rounded-full" />
                        ) : (
                          <UserRound className="h-8 w-8" />
                        )}
                        <span className="text-sm font-semibold">{user.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/settings/profile" className="flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          {t("profile")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {t("settings")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/signup">{t("signUp")}</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signin">{t("signIn")}</Link>
                  </Button>
                </div>
              )}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMenu} />
          <div className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden">
            <nav className="flex flex-col py-4 px-4 space-y-2">
              <Link
                href="/lists"
                className="flex items-center text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={closeMenu}
              >
                {t("collections")}
              </Link>
              <Link
                href="/explore"
                className="flex items-center text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={closeMenu}
              >
                {t("explore")}
              </Link>
              <Link
                href="/admin/theme"
                className="flex items-center text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={closeMenu}
              >
                {t("themes")}
              </Link>
              {user ? (
                <div className="space-y-0 pt-3 border-t border-border">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={user.name || "User"} width={56} height={56} className="rounded-full" />
                    ) : (
                      <UserRound className="h-9 w-9" />
                    )}
                    <div>
                      <span className="font-medium text-base">{user.name}</span>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/settings/profile"
                      className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                      onClick={closeMenu}
                    >
                      <UserRound className="h-4 w-4" />
                      {t("profile")}
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                      onClick={closeMenu}
                    >
                      <Settings className="h-4 w-4" />
                      {t("settings")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-3 border-t border-border">
                  <Button variant="outline" asChild className="w-full h-10 text-base">
                    <Link href="/signup" onClick={closeMenu}>
                      {t("signUp")}
                    </Link>
                  </Button>
                  <Button asChild className="w-full h-10 text-base">
                    <Link href="/signin" onClick={closeMenu}>
                      {t("signIn")}
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
};
