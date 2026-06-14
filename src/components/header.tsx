"use client";

import React, { useState, useEffect } from "react";
import { Menu, UserRound, X, Settings, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
            <Link href="/" className="text-2xl font-bold bg-clip-text text-primary cursor-pointer">
              CartaFlow
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/lists" className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer">
                {t("lists")}
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
                        <Link href="/settings/profile" className="flex items-center gap-2 cursor-pointer">
                          <UserRound className="h-4 w-4" />
                          {t("profile")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          {t("settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("signOut")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/signin" className="cursor-pointer">{t("signIn")}</Link>
                </Button>
              )}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full cursor-pointer"
              onClick={toggleMenu}
              aria-label={t("menu")}
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
                className="flex items-center text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted cursor-pointer"
                onClick={closeMenu}
              >
                {t("lists")}
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
                      className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={closeMenu}
                    >
                      <UserRound className="h-4 w-4" />
                      {t("profile")}
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={closeMenu}
                    >
                      <Settings className="h-4 w-4" />
                      {t("settings")}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors py-2 px-3 rounded-lg cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-3 border-t border-border">
                  <Button asChild className="w-full h-10 text-base">
                    <Link href="/signin" onClick={closeMenu} className="cursor-pointer">
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