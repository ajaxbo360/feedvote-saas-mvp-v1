'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface KanbanItemProps {
  id: string;
  title: string;
  description?: string;
  votes: number;
}

export function KanbanItem({ id, title, description, votes }: KanbanItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
          {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">👍 {votes}</span>
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
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
