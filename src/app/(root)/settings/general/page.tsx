"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Settings, Database, Shield, Globe, Clock, HardDrive } from "lucide-react";

export default function GeneralPage() {
  const [settings, setSettings] = useState({
    siteName: "CartaFlow",
    siteDescription: "A federated social media platform",
    adminEmail: "admin@cartaflow.com",
    maintenanceMode: false,
    registrationEnabled: true,
    inviteOnly: false,
    defaultLanguage: "en",
    timezone: "Europe/Paris",
  });

  const [storage, setStorage] = useState({
    maxFileSize: "10",
    allowedFileTypes: "jpg,jpeg,png,gif,webp,mp4,webm",
    storageProvider: "local",
    s3Bucket: "",
    s3Region: "",
    s3AccessKey: "",
    s3SecretKey: "",
  });

  const [backup, setBackup] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: "30",
    backupLocation: "/backups",
  });

  const [security, setSecurity] = useState({
    enforceHTTPS: true,
    csrfProtection: true,
    rateLimiting: true,
    sessionTimeout: "24",
    passwordMinLength: "8",
    requireEmailVerification: true,
  });

  const handleSettingChange = (category: string, field: string, value: string | boolean) => {
    switch (category) {
      case "settings":
        setSettings(prev => ({ ...prev, [field]: value }));
        break;
      case "storage":
        setStorage(prev => ({ ...prev, [field]: value }));
        break;
      case "backup":
        setBackup(prev => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecurity(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const handleSave = async () => {
    console.info("Saving general settings", { settings, storage, backup, security });
  };

  const runBackupNow = async () => {
    console.info("Running backup now");
    alert("Backup started successfully!");
  };

  const clearCache = async () => {
    console.info("Clearing cache");
    alert("Cache cleared successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">General Settings</h2>
        <p className="text-muted-foreground">Configure basic application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Site Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleSettingChange("settings", "siteName", e.target.value)}
                placeholder="Your Site Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange("settings", "adminEmail", e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Site Description</label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange("settings", "siteDescription", e.target.value)}
              placeholder="Describe your site..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => handleSettingChange("settings", "defaultLanguage", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange("settings", "timezone", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="UTC">UTC</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Maintenance Mode</label>
                <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange("settings", "maintenanceMode", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Registration Enabled</label>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <input
                type="checkbox"
                checked={settings.registrationEnabled}
                onChange={(e) => handleSettingChange("settings", "registrationEnabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Invite Only</label>
                <p className="text-sm text-muted-foreground">Require invitations to register</p>
              </div>
              <input
                type="checkbox"
                checked={settings.inviteOnly}
                onChange={(e) => handleSettingChange("settings", "inviteOnly", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                disabled={!settings.registrationEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max File Size (MB)</label>
              <Input
                value={storage.maxFileSize}
                onChange={(e) => handleSettingChange("storage", "maxFileSize", e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Storage Provider</label>
              <select
                value={storage.storageProvider}
                onChange={(e) => handleSettingChange("storage", "storageProvider", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="local">Local Storage</option>
                <option value="s3">Amazon S3</option>
                <option value="gcs">Google Cloud Storage</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Allowed File Types</label>
            <Input
              value={storage.allowedFileTypes}
              onChange={(e) => handleSettingChange("storage", "allowedFileTypes", e.target.value)}
              placeholder="jpg,jpeg,png,gif,webp,mp4,webm"
            />
          </div>

          {storage.storageProvider === "s3" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">S3 Bucket</label>
                <Input
                  value={storage.s3Bucket}
                  onChange={(e) => handleSettingChange("storage", "s3Bucket", e.target.value)}
                  placeholder="your-bucket-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">S3 Region</label>
                <Input
                  value={storage.s3Region}
                  onChange={(e) => handleSettingChange("storage", "s3Region", e.target.value)}
                  placeholder="us-east-1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Access Key</label>
                <Input
                  value={storage.s3AccessKey}
                  onChange={(e) => handleSettingChange("storage", "s3AccessKey", e.target.value)}
                  placeholder="Your access key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Secret Key</label>
                <Input
                  type="password"
                  value={storage.s3SecretKey}
                  onChange={(e) => handleSettingChange("storage", "s3SecretKey", e.target.value)}
                  placeholder="Your secret key"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Automatic Backup</label>
              <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
            </div>
            <input
              type="checkbox"
              checked={backup.autoBackup}
              onChange={(e) => handleSettingChange("backup", "autoBackup", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          {backup.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <select
                  value={backup.backupFrequency}
                  onChange={(e) => handleSettingChange("backup", "backupFrequency", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Retention (days)</label>
                <Input
                  value={backup.backupRetention}
                  onChange={(e) => handleSettingChange("backup", "backupRetention", e.target.value)}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={backup.backupLocation}
                  onChange={(e) => handleSettingChange("backup", "backupLocation", e.target.value)}
                  placeholder="/backups"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={runBackupNow}>
              Run Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enforce HTTPS</label>
                <p className="text-sm text-muted-foreground">Redirect HTTP to HTTPS</p>
              </div>
              <input
                type="checkbox"
                checked={security.enforceHTTPS}
                onChange={(e) => handleSettingChange("security", "enforceHTTPS", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">CSRF Protection</label>
                <p className="text-sm text-muted-foreground">Prevent cross-site requests</p>
              </div>
              <input
                type="checkbox"
                checked={security.csrfProtection}
                onChange={(e) => handleSettingChange("security", "csrfProtection", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Rate Limiting</label>
                <p className="text-sm text-muted-foreground">Limit API requests</p>
              </div>
              <input
                type="checkbox"
                checked={security.rateLimiting}
                onChange={(e) => handleSettingChange("security", "rateLimiting", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Verification</label>
                <p className="text-sm text-muted-foreground">Require email verification</p>
              </div>
              <input
                type="checkbox"
                checked={security.requireEmailVerification}
                onChange={(e) => handleSettingChange("security", "requireEmailVerification", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (hours)</label>
              <Input
                value={security.sessionTimeout}
                onChange={(e) => handleSettingChange("security", "sessionTimeout", e.target.value)}
                placeholder="24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Password Length</label>
              <Input
                value={security.passwordMinLength}
                onChange={(e) => handleSettingChange("security", "passwordMinLength", e.target.value)}
                placeholder="8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCache}>
              Clear Cache
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Restart Application
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save General Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}