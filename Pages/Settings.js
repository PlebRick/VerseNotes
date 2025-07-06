
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { BibleNote } from "@/entities/BibleNote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, BookOpen, Palette, Bell, Download, CloudOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    default_translation: "ESV",
    font_size: "medium",
    theme: "light",
    auto_save: true,
    verse_numbers: true,
    paragraph_breaks: true,
    notifications: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.settings) {
        setSettings({ ...settings, ...currentUser.settings });
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ settings });
      // Show success feedback
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportNotes = async () => {
    setIsExporting(true);
    try {
      const allNotes = await BibleNote.list("-created_date", 1000); // Fetch up to 1000 notes

      let markdownContent = `# Bible Study Notes\n\nExported on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

      allNotes.forEach(note => {
        markdownContent += `## ${note.title}\n\n`;
        markdownContent += `**Reference:** ${note.verse_reference}\n\n`;
        markdownContent += `**Tags:** ${note.tags ? note.tags.join(', ') : 'None'}\n\n`;

        // Convert basic HTML from react-quill to Markdown
        let content = note.content;
        content = content.replace(/<p>/g, '\n').replace(/<\/p>/g, '');
        content = content.replace(/<strong>/g, '**').replace(/<\/strong>/g, '**');
        content = content.replace(/<em>/g, '*').replace(/<\/em>/g, '*');
        content = content.replace(/<ul>/g, '').replace(/<\/ul>/g, '');
        content = content.replace(/<ol>/g, '').replace(/<\/ol>/g, '');
        content = content.replace(/<li>/g, '* ').replace(/<\/li>/g, '\n');

        markdownContent += `${content}\n\n---\n\n`;
      });

      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bible_notes_export.md");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error exporting notes:", error);
    }
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-slate-600 mt-2">Customize your Bible study experience</p>
        </div>

        <div className="grid gap-6">
          {/* Bible Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Bible Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="translation">Default Translation</Label>
                  <Select
                    value={settings.default_translation}
                    onValueChange={(value) => handleSettingChange("default_translation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select translation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESV">ESV</SelectItem>
                      <SelectItem value="NIV">NIV</SelectItem>
                      <SelectItem value="NASB">NASB</SelectItem>
                      <SelectItem value="KJV">KJV</SelectItem>
                      <SelectItem value="NKJV">NKJV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select
                    value={settings.font_size}
                    onValueChange={(value) => handleSettingChange("font_size", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="verse-numbers">Show Verse Numbers</Label>
                    <p className="text-sm text-slate-500">Display verse numbers in text</p>
                  </div>
                  <Switch
                    id="verse-numbers"
                    checked={settings.verse_numbers}
                    onCheckedChange={(checked) => handleSettingChange("verse_numbers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="paragraph-breaks">Paragraph Breaks</Label>
                    <p className="text-sm text-slate-500">Show paragraph formatting</p>
                  </div>
                  <Switch
                    id="paragraph-breaks"
                    checked={settings.paragraph_breaks}
                    onCheckedChange={(checked) => handleSettingChange("paragraph_breaks", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save">Auto-save Notes</Label>
                    <p className="text-sm text-slate-500">Automatically save changes</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.auto_save}
                    onCheckedChange={(checked) => handleSettingChange("auto_save", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-slate-500">Daily reading reminders</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-slate-600 max-w-xs">
                  Export all your notes to a Markdown file for backup or use in other applications.
                </div>
                <Button
                    onClick={handleExportNotes}
                    disabled={isExporting}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Exporting...' : 'Export All Notes'}
                </Button>
               </div>

               <Separator />

                <Alert>
                    <CloudOff className="h-4 w-4" />
                    <AlertTitle>Cloud Sync</AlertTitle>
                    <AlertDescription>
                        Automatic syncing with services like Google Cloud is not currently supported. You can use the export feature to manually back up your data.
                    </AlertDescription>
                </Alert>

            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-slate-700 hover:bg-slate-800"
            >
                {isSaving ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
