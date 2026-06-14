"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Globe, Server, Shield, Users, Plus, X, Check, AlertTriangle } from "lucide-react";

interface FederatedServer {
  id: string;
  domain: string;
  status: "connected" | "pending" | "blocked" | "error";
  software: string;
  version: string;
  userCount: number;
  lastSync: string;
}

export default function FediversePage() {
  const [settings, setSettings] = useState({
    instanceDomain: "cartaflow.example.com",
    publicRegistration: true,
    requireApproval: true,
    federationEnabled: true,
    allowNewConnections: true,
  });

  const [servers, setServers] = useState<FederatedServer[]>([
    {
      id: "1",
      domain: "mastodon.social",
      status: "connected",
      software: "Mastodon",
      version: "4.2.1",
      userCount: 847520,
      lastSync: "2 minutes ago",
    },
    {
      id: "2",
      domain: "lemmy.ml",
      status: "connected",
      software: "Lemmy",
      version: "0.19.0",
      userCount: 45230,
      lastSync: "5 minutes ago",
    },
    {
      id: "3",
      domain: "spam.example.com",
      status: "blocked",
      software: "Unknown",
      version: "Unknown",
      userCount: 0,
      lastSync: "Never",
    },
  ]);

  const [newServerDomain, setNewServerDomain] = useState("");

  const handleSettingChange = (field: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAddServer = () => {
    if (!newServerDomain.trim()) return;
    
    const newServer: FederatedServer = {
      id: Date.now().toString(),
      domain: newServerDomain.trim(),
      status: "pending",
      software: "Unknown",
      version: "Unknown",
      userCount: 0,
      lastSync: "Never",
    };
    
    setServers([...servers, newServer]);
    setNewServerDomain("");
  };

  const handleRemoveServer = (serverId: string) => {
    if (confirm("Remove this federated server?")) {
      setServers(servers.filter(s => s.id !== serverId));
    }
  };

  const handleBlockServer = (serverId: string) => {
    setServers(servers.map(s => 
      s.id === serverId ? { ...s, status: "blocked" as const } : s,
    ));
  };

  const handleUnblockServer = (serverId: string) => {
    setServers(servers.map(s => 
      s.id === serverId ? { ...s, status: "connected" as const } : s,
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSave = async () => {
    console.info("Saving fediverse settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Fediverse Settings</h2>
        <p className="text-muted-foreground">Manage federation and server connections</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Instance Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Instance Domain</label>
            <Input
              value={settings.instanceDomain}
              onChange={(e) => handleSettingChange("instanceDomain", e.target.value)}
              placeholder="your-instance.com"
            />
            <p className="text-sm text-muted-foreground">
              This is your instance&apos;s public domain name used for federation
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enable Federation</label>
                <p className="text-sm text-muted-foreground">Allow communication with other fediverse servers</p>
              </div>
              <input
                type="checkbox"
                checked={settings.federationEnabled}
                onChange={(e) => handleSettingChange("federationEnabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Allow New Connections</label>
                <p className="text-sm text-muted-foreground">Automatically accept federation requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowNewConnections}
                onChange={(e) => handleSettingChange("allowNewConnections", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                disabled={!settings.federationEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Public Registration</label>
              <p className="text-sm text-muted-foreground">Allow anyone to create an account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.publicRegistration}
              onChange={(e) => handleSettingChange("publicRegistration", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Require Approval</label>
              <p className="text-sm text-muted-foreground">New accounts need admin approval</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireApproval}
              onChange={(e) => handleSettingChange("requireApproval", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
              disabled={!settings.publicRegistration}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Federated Servers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newServerDomain}
              onChange={(e) => setNewServerDomain(e.target.value)}
              placeholder="Enter server domain (e.g., mastodon.social)"
              onKeyPress={(e) => e.key === "Enter" && handleAddServer()}
            />
            <Button onClick={handleAddServer} disabled={!newServerDomain.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </div>

          <div className="space-y-3">
            {servers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium truncate">{server.domain}</h4>
                    {getStatusBadge(server.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="font-medium">Software:</span> {server.software}
                    </div>
                    <div>
                      <span className="font-medium">Version:</span> {server.version}
                    </div>
                    <div>
                      <span className="font-medium">Users:</span> {server.userCount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Sync:</span> {server.lastSync}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {server.status === "blocked" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnblockServer(server.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Unblock
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBlockServer(server.id)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Block
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveServer(server.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {servers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No federated servers configured</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Federation Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                Changing federation settings may affect communication with other servers. 
                Make sure you understand the implications before making changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Federation Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}