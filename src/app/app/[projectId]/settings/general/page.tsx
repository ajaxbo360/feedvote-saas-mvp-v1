'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function GeneralSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    name: 'Project Name',
    description: 'Project description goes here...',
    website: 'https://example.com',
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);

    toast({
      title: 'Settings saved',
      description: 'Your project settings have been updated successfully.',
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">General Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Basic information about your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
