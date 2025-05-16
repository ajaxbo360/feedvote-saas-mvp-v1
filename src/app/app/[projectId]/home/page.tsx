import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { MoreHorizontal, CheckCircle, Clock, Square, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectHomePage({ params }: PageProps) {
  const { projectId } = params;
  const supabase = await createClient();

  // Get the current user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // In a real app, we'd fetch the project data and requests from Supabase
  // For now, use mock data
  const project = {
    id: projectId,
    name: 'xxx',
  };

  // Mock feature requests data
  const pendingRequests = [
    { id: '1', title: 'This is a sample request', votes: 4 },
    { id: '2', title: 'This is another sample request', votes: 3 },
  ];

  const approvedRequests = [{ id: '3', title: 'This is another sample request', votes: 2 }];

  const inProgressRequests = [{ id: '4', title: 'This is an in-progress feature request', votes: 8 }];

  const doneRequests = [];

  const rejectedRequests = [];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={`${project.name}`} />

      <div className="flex flex-col gap-4">
        <div className="py-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Board</h1>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Button variant="outline" size="sm" className="mr-4">
                <span>Custom tags</span>
              </Button>
            </div>

            <div className="flex items-center">
              <div className="mr-4">
                <Button variant="outline" size="sm">
                  <span>Sort by Votes</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </Button>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Create</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Pending Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Pending</span>
              <Square className="h-4 w-4 text-gray-500" />
              <span className="ml-1 bg-gray-200 text-gray-800 px-1 rounded text-xs">{pendingRequests.length}</span>
            </div>

            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-3 bg-white shadow-sm">
                <div className="flex justify-between">
                  <div className="font-medium text-sm mb-2">{request.title}</div>
                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-100 rounded-sm w-7 h-6 flex items-center justify-center text-xs font-medium">
                  {request.votes}
                </div>
                <div className="text-xs text-gray-500 mt-2">Drag this around to update the status</div>
              </Card>
            ))}
          </div>

          {/* Approved Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Approved</span>
              <CheckCircle className="h-4 w-4 text-yellow-500" />
              <span className="ml-1 bg-gray-200 text-gray-800 px-1 rounded text-xs">{approvedRequests.length}</span>
            </div>

            {approvedRequests.map((request) => (
              <Card key={request.id} className="p-3 bg-white shadow-sm">
                <div className="flex justify-between">
                  <div className="font-medium text-sm mb-2">{request.title}</div>
                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-100 rounded-sm w-7 h-6 flex items-center justify-center text-xs font-medium">
                  {request.votes}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  You can delete this by clicking on the three dots on the right portion of this card
                </div>
              </Card>
            ))}
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">In Progress</span>
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="ml-1 bg-gray-200 text-gray-800 px-1 rounded text-xs">{inProgressRequests.length}</span>
            </div>

            {inProgressRequests.map((request) => (
              <Card key={request.id} className="p-3 bg-white shadow-sm">
                <div className="flex justify-between">
                  <div className="font-medium text-sm mb-2">{request.title}</div>
                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-100 rounded-sm w-7 h-6 flex items-center justify-center text-xs font-medium">
                  {request.votes}
                </div>
                <div className="text-xs text-gray-500 mt-2">Show your users that you listen and care for them</div>
              </Card>
            ))}
          </div>

          {/* Done Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Done</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="ml-1 bg-gray-200 text-gray-800 px-1 rounded text-xs">{doneRequests.length}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-gray-400">
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-100 rounded-full mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm">No posts yet</p>
                <p className="text-xs">No posts that are done</p>
              </div>
            </div>
          </div>

          {/* Rejected Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Rejected</span>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="ml-1 bg-gray-200 text-gray-800 px-1 rounded text-xs">{rejectedRequests.length}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-gray-400">
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-100 rounded-full mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm">No posts yet</p>
                <p className="text-xs">No posts that are rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
