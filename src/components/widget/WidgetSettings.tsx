import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetSettings as IWidgetSettings, DEFAULT_WIDGET_SETTINGS } from '@/types/widget-settings';
import { createClient } from '@/utils/supabase/client';

interface WidgetSettingsProps {
  projectId: string;
}

export function WidgetSettings({ projectId }: WidgetSettingsProps) {
  const [settings, setSettings] = useState<IWidgetSettings>(DEFAULT_WIDGET_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, [projectId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('widget_settings').eq('id', projectId).single();

      if (error) throw error;
      if (data?.widget_settings) {
        setSettings(data.widget_settings as IWidgetSettings);
      }
    } catch (error) {
      console.error('Error loading widget settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('projects').update({ widget_settings: settings }).eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving widget settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserParameter = (
    param: keyof IWidgetSettings['userParameters'],
    field: 'enabled' | 'required',
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      userParameters: {
        ...prev.userParameters,
        [param]: {
          ...prev.userParameters[param],
          [field]: value,
          // If required is true, enabled must also be true
          enabled: field === 'required' ? (value ? true : prev.userParameters[param].enabled) : value,
        },
      },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Settings</CardTitle>
        <CardDescription>Customize your feedback widget's appearance and behavior</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="parameters">User Parameters</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <ColorPicker
                    color={settings.primaryColor}
                    onChange={(color) => setSettings((prev) => ({ ...prev, primaryColor: color }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <ColorPicker
                    color={settings.secondaryColor}
                    onChange={(color) => setSettings((prev) => ({ ...prev, secondaryColor: color }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={settings.position}
                  onValueChange={(value: IWidgetSettings['position']) =>
                    setSettings((prev) => ({ ...prev, position: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: IWidgetSettings['theme']) =>
                    setSettings((prev) => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={settings.buttonText}
                  onChange={(e) => setSettings((prev) => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Give Feedback"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters">
            <div className="space-y-6">
              {Object.entries(settings.userParameters).map(([param, config]) => (
                <div key={param} className="flex items-start justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">{param}</Label>
                    <p className="text-sm text-muted-foreground mt-1">Enable and configure {param} parameter</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Enable</Label>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) =>
                          updateUserParameter(param as keyof IWidgetSettings['userParameters'], 'enabled', checked)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Required</Label>
                      <Switch
                        checked={config.required}
                        disabled={!config.enabled}
                        onCheckedChange={(checked) =>
                          updateUserParameter(param as keyof IWidgetSettings['userParameters'], 'required', checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Allow Anonymous Feedback</Label>
                  <p className="text-sm text-muted-foreground mt-1">Let users submit feedback without identification</p>
                </div>
                <Switch
                  checked={settings.allowAnonymous}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowAnonymous: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Whitelisted Domains</Label>
                <Input
                  value={settings.whitelistedDomains.join(', ')}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      whitelistedDomains: e.target.value
                        .split(',')
                        .map((d) => d.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="example.com, app.example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to allow all domains. Add comma-separated domains to restrict widget usage.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground mt-1">Track widget usage and interactions</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableAnalytics: checked }))}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base">Track Events</Label>
                {Object.entries(settings.trackEvents).map(([event, enabled]) => (
                  <div key={event} className="flex items-center justify-between">
                    <Label>{event}</Label>
                    <Switch
                      checked={enabled}
                      disabled={!settings.enableAnalytics}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          trackEvents: {
                            ...prev.trackEvents,
                            [event]: checked,
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
