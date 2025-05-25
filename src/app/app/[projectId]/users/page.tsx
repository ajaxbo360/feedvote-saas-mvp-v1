'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Filter, ArrowUpDown } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_seen?: string;
  total_votes: number;
  total_comments: number;
  status: 'active' | 'inactive';
}

interface DatabaseUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_seen?: string;
  total_votes?: number;
  total_comments?: number;
  project_id: string;
}

export default function UsersPage({ params }: { params: { projectId: string } }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        // In a real implementation, this would fetch from your users table
        // and join with votes and comments tables to get the counts
        const { data, error } = await supabase.from('users').select('*').eq('project_id', params.projectId);

        if (error) throw error;

        // Transform the data to match our interface
        const transformedData: UserData[] =
          (data as DatabaseUser[])?.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            created_at: user.created_at,
            last_seen: user.last_seen,
            total_votes: user.total_votes || 0,
            total_comments: user.total_comments || 0,
            status: user.last_seen ? 'active' : 'inactive',
          })) || [];

        setUsers(transformedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [params.projectId]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && user.status === currentTab;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Track and manage users who have interacted with your feedback board.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Active Users</span>
            <span className="text-2xl font-bold text-green-600">{stats.active}</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Inactive Users</span>
            <span className="text-2xl font-bold text-gray-400">{stats.inactive}</span>
          </div>
        </Card>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:min-w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={currentTab} className="mt-4">
          <Card>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">
                      <Button variant="ghost" className="flex items-center gap-1 -ml-3 h-8">
                        User
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-center">Votes</th>
                    <th className="px-4 py-3 font-medium text-center">Comments</th>
                    <th className="px-4 py-3 font-medium">Last Seen</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-medium">
                                {user.name?.[0].toUpperCase() || user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}
                          >
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{user.total_votes}</td>
                        <td className="px-4 py-3 text-center">{user.total_comments}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.last_seen ? new Date(user.last_seen).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
