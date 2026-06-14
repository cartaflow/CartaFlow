"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Camera, Link2, Instagram, Twitter, Github, Globe } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: "johndoe",
    displayName: "John Doe",
    description: "Full-stack developer passionate about open source",
    website: "https://johndoe.com",
    twitter: "@johndoe",
    github: "johndoe",
    instagram: "johndoe",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.info("Saving profile:", profile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your public profile information</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Profile Photo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profile.displayName.charAt(0)}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-background border-2 border-background rounded-full p-1 shadow-sm hover:shadow-md transition-shadow">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Upload Photo</Button>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={profile.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    value={profile.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Enter display name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={profile.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Links & Social Media</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </label>
                <Input
                  value={profile.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </label>
                  <Input
                    value={profile.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </label>
                  <Input
                    value={profile.github}
                    onChange={(e) => handleInputChange("github", e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </label>
                <Input
                  value={profile.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
