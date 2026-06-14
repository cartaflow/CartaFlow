"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Palette, Upload, Image, Eye, Moon, Sun, Monitor } from "lucide-react";

export default function ThemePage() {
  const [theme, setTheme] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    borderRadius: "0.5rem",
    fontSize: "14px",
  });

  const [branding, setBranding] = useState({
    siteName: "CartaFlow",
    tagline: "Your federated social platform",
    logoUrl: "",
    faviconUrl: "",
    customCSS: "",
  });

  const [darkMode, setDarkMode] = useState("system");

  const handleThemeChange = (field: string, value: string) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandingChange = (field: string, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.info("Saving theme settings:", { theme, branding, darkMode });
  };

  const resetToDefault = () => {
    if (confirm("Reset all theme settings to default?")) {
      setTheme({
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        accentColor: "#10b981",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        borderRadius: "0.5rem",
        fontSize: "14px",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Theme & Branding</h2>
        <p className="text-muted-foreground">Customize the appearance and branding of your application</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Site Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input
                value={branding.siteName}
                onChange={(e) => handleBrandingChange("siteName", e.target.value)}
                placeholder="Your site name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <Input
                value={branding.tagline}
                onChange={(e) => handleBrandingChange("tagline", e.target.value)}
                placeholder="A short description"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  {branding.logoUrl ? (
                    <img src={branding.logoUrl} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  {branding.faviconUrl ? (
                    <img src={branding.faviconUrl} alt="Favicon preview" className="w-full h-full object-cover rounded" />
                  ) : (
                    <Image className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Favicon
                  </Button>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                  className="w-10 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                  placeholder="#64748b"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                  className="w-10 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={theme.accentColor}
                  onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dark Mode Setting</label>
            <div className="flex gap-2">
              <Button
                variant={darkMode === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setDarkMode("light")}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={darkMode === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setDarkMode("dark")}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={darkMode === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setDarkMode("system")}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography & Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Border Radius</label>
              <select
                value={theme.borderRadius}
                onChange={(e) => handleThemeChange("borderRadius", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="0">None</option>
                <option value="0.25rem">Small</option>
                <option value="0.5rem">Medium</option>
                <option value="0.75rem">Large</option>
                <option value="1rem">Extra Large</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Font Size</label>
              <select
                value={theme.fontSize}
                onChange={(e) => handleThemeChange("fontSize", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="12px">Small (12px)</option>
                <option value="14px">Medium (14px)</option>
                <option value="16px">Large (16px)</option>
                <option value="18px">Extra Large (18px)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Styles</label>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
              value={branding.customCSS}
              onChange={(e) => handleBrandingChange("customCSS", e.target.value)}
              placeholder="/* Add your custom CSS here */"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Add custom CSS to further customize your site&apos;s appearance. Use with caution as this can override existing styles.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}