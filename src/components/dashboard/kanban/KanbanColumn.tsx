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
}

export function KanbanColumn({ id, title, icon, items }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span>{icon}</span>
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">({items.length})</span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[200px]">
        <SortableContext items={items.map((item) => item.id)}>
          {items.map((item) => (
            <KanbanItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              votes={item.votes}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">No posts yet</div>
        )}
      </div>
    </div>
  );
}
