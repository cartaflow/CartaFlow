"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Bell, Mail, MessageSquare, Settings, Users } from "lucide-react";

export default function NotificationsPage() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@cartaflow.com",
    smtpPassword: "",
    fromName: "CartaFlow",
    fromEmail: "noreply@cartaflow.com"
  });

  const [notificationTypes, setNotificationTypes] = useState({
    newUser: { email: true, push: true, inApp: true },
    newPost: { email: false, push: true, inApp: true },
    newComment: { email: true, push: true, inApp: true },
    mention: { email: true, push: true, inApp: true },
    follow: { email: false, push: true, inApp: true },
    like: { email: false, push: false, inApp: true },
    moderation: { email: true, push: true, inApp: true },
    systemAlert: { email: true, push: true, inApp: true }
  });

  const [pushSettings, setPushSettings] = useState({
    vapidPublicKey: "",
    vapidPrivateKey: "",
    enabled: false
  });

  const handleEmailSettingChange = (field: string, value: string) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: keyof typeof notificationTypes, method: string, value: boolean) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], [method]: value }
    }));
  };

  const handlePushSettingChange = (field: string, value: string | boolean) => {
    setPushSettings(prev => ({ ...prev, [field]: value }));
  };

  const testEmailConfiguration = async () => {
    console.log("Testing email configuration");
    alert("Test email sent!");
  };

  const generateVapidKeys = () => {
    setPushSettings(prev => ({
      ...prev,
      vapidPublicKey: "BCd..." + Math.random().toString(36),
      vapidPrivateKey: "abc..." + Math.random().toString(36)
    }));
  };

  const handleSave = async () => {
    console.log("Saving notification settings");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <p className="text-muted-foreground">Configure how notifications are sent to users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Server</label>
              <Input
                value={emailSettings.smtpServer}
                onChange={(e) => handleEmailSettingChange("smtpServer", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Port</label>
              <Input
                value={emailSettings.smtpPort}
                onChange={(e) => handleEmailSettingChange("smtpPort", e.target.value)}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Username</label>
              <Input
                value={emailSettings.smtpUser}
                onChange={(e) => handleEmailSettingChange("smtpUser", e.target.value)}
                placeholder="username@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Password</label>
              <Input
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => handleEmailSettingChange("smtpPassword", e.target.value)}
                placeholder="Your SMTP password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Name</label>
              <Input
                value={emailSettings.fromName}
                onChange={(e) => handleEmailSettingChange("fromName", e.target.value)}
                placeholder="Your Site Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">From Email</label>
              <Input
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => handleEmailSettingChange("fromEmail", e.target.value)}
                placeholder="noreply@example.com"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={testEmailConfiguration}>
              Test Email Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Enable Push Notifications</label>
              <p className="text-sm text-muted-foreground">Allow users to receive push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={pushSettings.enabled}
              onChange={(e) => handlePushSettingChange("enabled", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          {pushSettings.enabled && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">VAPID Public Key</label>
                <Input
                  value={pushSettings.vapidPublicKey}
                  onChange={(e) => handlePushSettingChange("vapidPublicKey", e.target.value)}
                  placeholder="Your VAPID public key"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">VAPID Private Key</label>
                <Input
                  type="password"
                  value={pushSettings.vapidPrivateKey}
                  onChange={(e) => handlePushSettingChange("vapidPrivateKey", e.target.value)}
                  placeholder="Your VAPID private key"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={generateVapidKeys}>
                  Generate VAPID Keys
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium border-b pb-2">
              <div>Event Type</div>
              <div className="text-center">Email</div>
              <div className="text-center">Push</div>
              <div className="text-center">In-App</div>
            </div>

            {(Object.entries(notificationTypes) as [keyof typeof notificationTypes, { email: boolean; push: boolean; inApp: boolean }][]).map(([type, settings]) => (
              <div key={type} className="grid grid-cols-4 gap-4 items-center py-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="text-center">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={(e) => handleNotificationChange(type, "email", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="text-center">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={(e) => handleNotificationChange(type, "push", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!pushSettings.enabled}
                  />
                </div>
                <div className="text-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp}
                    onChange={(e) => handleNotificationChange(type, "inApp", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Notification Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}