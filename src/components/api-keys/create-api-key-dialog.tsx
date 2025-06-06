'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCsrfHeader } from '@/utils/csrf-protection';
import { useToast } from '@/components/ui/use-toast';
import { ApiKey, ApiKeyType } from '@/types/api-keys';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KeyIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  key_type: z.enum(['public', 'secret', 'mobile'], {
    required_error: 'Please select a key type',
  }),
  expires_at: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateApiKeyDialogProps {
  projectId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (apiKey: ApiKey) => void;
}

async function createApiKey(projectId: string, data: FormValues): Promise<ApiKey> {
  const response = await fetch('/api/api-keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getCsrfHeader()),
    },
    body: JSON.stringify({
      ...data,
      project_id: projectId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create API key');
  }

  const result = await response.json();
  return result.data;
}

export function CreateApiKeyDialog({
  projectId,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: CreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      key_type: 'public' as ApiKeyType,
      expires_at: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const apiKey = await createApiKey(projectId, values);
      setCreatedKey(apiKey);

      if (onSuccess) {
        onSuccess(apiKey);
      }

      form.reset();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setCreatedKey(null);
    setCopied(false);
    form.reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    setIsOpen(newOpen);
  };

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey.key_value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const keyTypeDescriptions = {
    public: 'For browser-based applications. Can be safely included in client-side code.',
    secret: 'For server-side applications. Must be kept secure and never exposed in client-side code.',
    mobile: 'For mobile applications. Use with caution as it may be accessible via app decompilation.',
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        {!createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key to authenticate requests to the FeedVote API.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="key_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a key type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="secret">Secret</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value ? keyTypeDescriptions[field.value as ApiKeyType] : 'Select a key type'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My API Key" {...field} disabled={loading} />
                      </FormControl>
                      <FormDescription>A descriptive name to identify this key</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Used for..."
                          {...field}
                          disabled={loading}
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>Add details about how this key will be used</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create API Key'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Your new API key has been created successfully. Copy it now as you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="default" className="mt-4">
              <KeyIcon className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>This API key will only be displayed once. Please store it securely.</AlertDescription>
            </Alert>

            <div className="mt-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">API Key</div>
                <div className="flex">
                  <code className="relative flex-1 rounded bg-muted px-[0.5rem] py-[0.4rem] font-mono text-sm font-semibold">
                    {createdKey.key_value}
                  </code>
                  <Button variant="outline" size="sm" className="ml-2 h-auto" onClick={copyToClipboard}>
                    {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-sm font-medium">Details</div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{createdKey.name}</div>
                  <div className="text-muted-foreground">Type:</div>
                  <div className="capitalize">{createdKey.key_type}</div>
                  {createdKey.description && (
                    <>
                      <div className="text-muted-foreground">Description:</div>
                      <div>{createdKey.description}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
