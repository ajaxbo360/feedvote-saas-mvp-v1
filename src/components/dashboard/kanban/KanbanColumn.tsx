'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { KanbanItem as KanbanItemType } from './KanbanBoard';
import { KanbanItem } from './KanbanItem';

interface KanbanColumnProps {
  id: string;
  title: string;
  icon: string;
  items: KanbanItemType[];
  onVote?: (id: string) => void;
  onStatusChange?: (id: string, status: 'rejected') => void;
}

export function KanbanColumn({ id, title, icon, items, onVote, onStatusChange }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full rounded-lg border border-border dark:border-gray-700 bg-transparent">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border dark:border-gray-700">
        <span>{icon}</span>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">({items.length})</span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 p-4 flex-1">
        <SortableContext items={items.map((item) => item.id)}>
          {items.map((item) => (
            <KanbanItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              votes={item.votes}
              onVote={onVote}
              onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-2xl mb-2">📬</span>
            No posts yet
          </div>
        )}
      </div>
    </div>
  );
}
