"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Shield, AlertTriangle, Eye, Ban, Plus, X } from "lucide-react";

export default function ModerationPage() {
  const [settings, setSettings] = useState({
    autoModeration: true,
    requireApproval: false,
    spamDetection: true,
    profanityFilter: true,
    linkModeration: false,
    imageModeration: true,
  });

  const [blockedWords, setBlockedWords] = useState([
    "spam", "scam", "fake", "bot",
  ]);

  const [blockedDomains, setBlockedDomains] = useState([
    "spam.com", "malicious.site",
  ]);

  const [allowedDomains, setAllowedDomains] = useState([
    "youtube.com", "github.com", "wikipedia.org",
  ]);

  const [newWord, setNewWord] = useState("");
  const [newBlockedDomain, setNewBlockedDomain] = useState("");
  const [newAllowedDomain, setNewAllowedDomain] = useState("");

  const [moderationRules, setModerationRules] = useState({
    maxPostLength: "2000",
    maxLinksPerPost: "3",
    maxMentionsPerPost: "5",
    rateLimitPosts: "10",
    rateLimitComments: "20",
  });

  const handleSettingChange = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (field: string, value: string) => {
    setModerationRules(prev => ({ ...prev, [field]: value }));
  };

  const addBlockedWord = () => {
    if (newWord.trim() && !blockedWords.includes(newWord.trim())) {
      setBlockedWords([...blockedWords, newWord.trim()]);
      setNewWord("");
    }
  };

  const removeBlockedWord = (word: string) => {
    setBlockedWords(blockedWords.filter(w => w !== word));
  };

  const addBlockedDomain = () => {
    if (newBlockedDomain.trim() && !blockedDomains.includes(newBlockedDomain.trim())) {
      setBlockedDomains([...blockedDomains, newBlockedDomain.trim()]);
      setNewBlockedDomain("");
    }
  };

  const removeBlockedDomain = (domain: string) => {
    setBlockedDomains(blockedDomains.filter(d => d !== domain));
  };

  const addAllowedDomain = () => {
    if (newAllowedDomain.trim() && !allowedDomains.includes(newAllowedDomain.trim())) {
      setAllowedDomains([...allowedDomains, newAllowedDomain.trim()]);
      setNewAllowedDomain("");
    }
  };

  const removeAllowedDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain));
  };

  const handleSave = async () => {
    console.info("Saving moderation settings");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Moderation Settings</h2>
        <p className="text-muted-foreground">Configure content moderation and safety features</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auto-Moderation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto-Moderation</label>
                <p className="text-sm text-muted-foreground">Automatically moderate content</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoModeration}
                onChange={(e) => handleSettingChange("autoModeration", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Require Approval</label>
                <p className="text-sm text-muted-foreground">All posts need approval</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => handleSettingChange("requireApproval", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Spam Detection</label>
                <p className="text-sm text-muted-foreground">Detect and block spam content</p>
              </div>
              <input
                type="checkbox"
                checked={settings.spamDetection}
                onChange={(e) => handleSettingChange("spamDetection", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Profanity Filter</label>
                <p className="text-sm text-muted-foreground">Filter inappropriate language</p>
              </div>
              <input
                type="checkbox"
                checked={settings.profanityFilter}
                onChange={(e) => handleSettingChange("profanityFilter", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Link Moderation</label>
                <p className="text-sm text-muted-foreground">Review posts with links</p>
              </div>
              <input
                type="checkbox"
                checked={settings.linkModeration}
                onChange={(e) => handleSettingChange("linkModeration", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Image Moderation</label>
                <p className="text-sm text-muted-foreground">Scan uploaded images</p>
              </div>
              <input
                type="checkbox"
                checked={settings.imageModeration}
                onChange={(e) => handleSettingChange("imageModeration", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Post Length</label>
              <Input
                value={moderationRules.maxPostLength}
                onChange={(e) => handleRuleChange("maxPostLength", e.target.value)}
                placeholder="2000"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Links Per Post</label>
              <Input
                value={moderationRules.maxLinksPerPost}
                onChange={(e) => handleRuleChange("maxLinksPerPost", e.target.value)}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Mentions Per Post</label>
              <Input
                value={moderationRules.maxMentionsPerPost}
                onChange={(e) => handleRuleChange("maxMentionsPerPost", e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Posts Per Hour Limit</label>
              <Input
                value={moderationRules.rateLimitPosts}
                onChange={(e) => handleRuleChange("rateLimitPosts", e.target.value)}
                placeholder="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Blocked Words
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Add blocked word..."
              onKeyPress={(e) => e.key === "Enter" && addBlockedWord()}
            />
            <Button onClick={addBlockedWord} disabled={!newWord.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {blockedWords.map((word) => (
              <Badge key={word} variant="destructive" className="flex items-center gap-1">
                {word}
                <button onClick={() => removeBlockedWord(word)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2 text-destructive">Blocked Domains</h4>
            <div className="flex gap-2 mb-2">
              <Input
                value={newBlockedDomain}
                onChange={(e) => setNewBlockedDomain(e.target.value)}
                placeholder="Add blocked domain..."
                onKeyPress={(e) => e.key === "Enter" && addBlockedDomain()}
              />
              <Button onClick={addBlockedDomain} disabled={!newBlockedDomain.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blockedDomains.map((domain) => (
                <Badge key={domain} variant="destructive" className="flex items-center gap-1">
                  {domain}
                  <button onClick={() => removeBlockedDomain(domain)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-green-600">Allowed Domains</h4>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAllowedDomain}
                onChange={(e) => setNewAllowedDomain(e.target.value)}
                placeholder="Add allowed domain..."
                onKeyPress={(e) => e.key === "Enter" && addAllowedDomain()}
              />
              <Button onClick={addAllowedDomain} disabled={!newAllowedDomain.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allowedDomains.map((domain) => (
                <Badge key={domain} className="bg-green-100 text-green-800 flex items-center gap-1">
                  {domain}
                  <button onClick={() => removeAllowedDomain(domain)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Moderation Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                Overly strict moderation can harm user experience. Find the right balance for your community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Moderation Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}