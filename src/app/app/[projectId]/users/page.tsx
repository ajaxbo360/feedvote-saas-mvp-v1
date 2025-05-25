'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Search, Download, Filter, SlidersHorizontal, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface UserData {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

interface DatabaseUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  project_id: string;
}

interface FilterOptions {
  dateRange: string;
}

export default function UsersPage({ params }: { params: { projectId: string } }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: 'all',
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('project_id', params.projectId);

        if (error) throw error;

        const transformedData: UserData[] =
          (data as DatabaseUser[])?.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            created_at: user.created_at,
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

    let matchesDateRange = true;
    if (filterOptions.dateRange !== 'all') {
      const now = new Date();
      const userDate = new Date(user.created_at);
      const daysDiff = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filterOptions.dateRange) {
        case '7days':
          matchesDateRange = daysDiff <= 7;
          break;
        case '30days':
          matchesDateRange = daysDiff <= 30;
          break;
        case '90days':
          matchesDateRange = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesDateRange;
  });

  const handleExport = () => {
    const csvContent = [
      ['App User ID', 'Email', 'Name', 'Created', 'User Spend'],
      ...filteredUsers.map((user) => [
        user.id,
        user.email,
        user.name,
        format(new Date(user.created_at), 'PP'),
        '$0.00',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleFilterReset = () => {
    setFilterOptions({
      dateRange: 'all',
    });
  };

  const activeFiltersCount = filterOptions.dateRange !== 'all' ? 1 : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground">Users that have interacted with your feature voting board.</p>
      </div>

      <div className="flex items-center justify-between">
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
          <Button variant="outline" size="icon" onClick={() => setShowFilterDialog(true)} className="relative">
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      <Card>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">APP USER ID</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">EMAIL</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">NAME</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">CREATED</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">USER SPEND</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-muted p-3">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">No users</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || filterOptions.dateRange !== 'all'
                          ? 'No users match your search criteria'
                          : 'No users have interacted with your board yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{user.id}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{format(new Date(user.created_at), 'PP')}</td>
                    <td className="px-4 py-3 text-sm">$0.00</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
            <DialogDescription>Refine the user list with specific criteria</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Date Range</h4>
                <select
                  value={filterOptions.dateRange}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      dateRange: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleFilterReset}>
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
