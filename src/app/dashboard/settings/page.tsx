'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    productName: 'Product One',
    productDescription: 'A powerful SaaS tool for productivity',
    websiteUrl: 'https://example.com/product-one',
    logoUrl: '',
  });

  const [feedbackSettings, setFeedbackSettings] = useState({
    enableFeedbackWidget: true,
    widgetPosition: 'bottom-right',
    collectAnonymousFeedback: false,
    notifyOnNewFeedback: true,
    autoApproveTestimonials: false,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    slackWebhookUrl: '',
    discordWebhookUrl: '',
    enableEmailNotifications: true,
  });

  const handleSaveGeneral = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your general settings have been updated successfully.',
    });
  };

  const handleSaveFeedback = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your feedback settings have been updated successfully.',
    });
  };

  const handleSaveIntegrations = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your integration settings have been updated successfully.',
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Settings'} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your product information and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={generalSettings.productName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, productName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  value={generalSettings.productDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, productDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={generalSettings.websiteUrl}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, websiteUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={generalSettings.logoUrl}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Settings</CardTitle>
              <CardDescription>Configure how feedback and testimonials are collected and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableFeedbackWidget">Enable Feedback Widget</Label>
                  <p className="text-sm text-muted-foreground">Show the feedback collection widget on your website</p>
                </div>
                <Switch
                  id="enableFeedbackWidget"
                  checked={feedbackSettings.enableFeedbackWidget}
                  onCheckedChange={(checked) =>
                    setFeedbackSettings({ ...feedbackSettings, enableFeedbackWidget: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="widgetPosition">Widget Position</Label>
                <Select
                  value={feedbackSettings.widgetPosition}
                  onValueChange={(value) => setFeedbackSettings({ ...feedbackSettings, widgetPosition: value })}
                  disabled={!feedbackSettings.enableFeedbackWidget}
                >
                  <SelectTrigger id="widgetPosition">
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

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="collectAnonymousFeedback">Allow Anonymous Feedback</Label>
                  <p className="text-sm text-muted-foreground">Let users submit feedback without signing in</p>
                </div>
                <Switch
                  id="collectAnonymousFeedback"
                  checked={feedbackSettings.collectAnonymousFeedback}
                  onCheckedChange={(checked) =>
                    setFeedbackSettings({ ...feedbackSettings, collectAnonymousFeedback: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifyOnNewFeedback">Notify on New Feedback</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications when new feedback is submitted</p>
                </div>
                <Switch
                  id="notifyOnNewFeedback"
                  checked={feedbackSettings.notifyOnNewFeedback}
                  onCheckedChange={(checked) =>
                    setFeedbackSettings({ ...feedbackSettings, notifyOnNewFeedback: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoApproveTestimonials">Auto-approve Testimonials</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve testimonials without manual review
                  </p>
                </div>
                <Switch
                  id="autoApproveTestimonials"
                  checked={feedbackSettings.autoApproveTestimonials}
                  onCheckedChange={(checked) =>
                    setFeedbackSettings({ ...feedbackSettings, autoApproveTestimonials: checked })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveFeedback} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect FeedVote with your other tools and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
                <Input
                  id="slackWebhookUrl"
                  value={integrationSettings.slackWebhookUrl}
                  onChange={(e) =>
                    setIntegrationSettings({
                      ...integrationSettings,
                      slackWebhookUrl: e.target.value,
                    })
                  }
                  placeholder="https://hooks.slack.com/services/..."
                />
                <p className="text-xs text-muted-foreground">
                  Receive notifications in Slack when new feedback is submitted
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordWebhookUrl">Discord Webhook URL</Label>
                <Input
                  id="discordWebhookUrl"
                  value={integrationSettings.discordWebhookUrl}
                  onChange={(e) =>
                    setIntegrationSettings({
                      ...integrationSettings,
                      discordWebhookUrl: e.target.value,
                    })
                  }
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-xs text-muted-foreground">
                  Receive notifications in Discord when new feedback is submitted
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={integrationSettings.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    setIntegrationSettings({
                      ...integrationSettings,
                      enableEmailNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveIntegrations} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
