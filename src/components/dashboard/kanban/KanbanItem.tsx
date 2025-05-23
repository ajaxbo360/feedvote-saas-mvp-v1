'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface KanbanItemProps {
  id: string;
  title: string;
  description?: string;
  votes: number;
  onVote?: (id: string) => void;
  onStatusChange?: (id: string, status: 'rejected') => void;
}

export function KanbanItem({ id, title, description, votes, onVote, onStatusChange }: KanbanItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleReject = () => {
    onStatusChange?.(id, 'rejected');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-move border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              onClick={handleVote}
              className="flex items-center justify-center w-8 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium text-gray-900 dark:text-white w-full text-center py-0.5 bg-gray-50 dark:bg-gray-800">
              {votes}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
            {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReject} className="text-red-600">
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
