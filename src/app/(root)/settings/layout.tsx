"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Shield,
  Palette,
  Globe,
  Bell,
  Settings,
  Users,
  Smartphone,
} from "lucide-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const settingsNavigation = [
  {
    title: "User Settings",
    items: [
      { name: "Profile", href: "/settings/profile", icon: User },
      { name: "Account", href: "/settings/account", icon: Mail },
      { name: "Sessions", href: "/settings/sessions", icon: Smartphone },
    ],
  },
  {
    title: "Admin Settings",
    items: [
      { name: "Theme & Branding", href: "/settings/theme", icon: Palette },
      { name: "Fediverse", href: "/settings/fediverse", icon: Globe },
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
      { name: "Moderation", href: "/settings/moderation", icon: Shield },
      { name: "Users", href: "/settings/users", icon: Users },
      { name: "General", href: "/settings/general", icon: Settings },
    ],
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      <div className="relative container mx-auto">
        <div className="absolute left-0 top-0 z-40 h-full w-80 border-r">
          <div className="flex h-full flex-col px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto">
              {settingsNavigation.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-3 px-2 text-sm font-medium text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="ml-80 flex-1">
          <div className="h-screen overflow-y-auto">
            <div className="container mx-auto px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
