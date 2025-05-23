'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { KanbanItem } from './KanbanItem';
import { createPortal } from 'react-dom';

export type Status = 'pending' | 'approved' | 'in_progress' | 'done' | 'rejected';

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  votes: number;
  status: Status;
}

const defaultItems: KanbanItem[] = [
  {
    id: '1',
    title: 'This is a sample request',
    description: 'Drag this around to update the status',
    votes: 4,
    status: 'pending',
  },
  {
    id: '2',
    title: 'This is another sample request',
    description: 'You can delete this by clicking on the three dots on the right portion of this card',
    votes: 2,
    status: 'approved',
  },
  {
    id: '3',
    title: 'This is an in-progress feature request',
    description: 'Show your users that you listen and care for them',
    votes: 8,
    status: 'in_progress',
  },
];

const columns: { id: Status; title: string; icon: string }[] = [
  { id: 'pending', title: 'Pending', icon: '👋' },
  { id: 'approved', title: 'Approved', icon: '👍' },
  { id: 'in_progress', title: 'In Progress', icon: '⚙️' },
  { id: 'done', title: 'Done', icon: '✅' },
  { id: 'rejected', title: 'Rejected', icon: '❌' },
];

export function KanbanBoard() {
  const [items, setItems] = useState<KanbanItem[]>(defaultItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required before drag starts
      },
    }),
  );

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((item) => item.id === active.id);
    const overColumn = columns.find((col) => col.id === over.id);

    if (!activeItem) return;

    if (overColumn) {
      setItems((items) =>
        items.map((item) =>
          item.id === activeItem.id
            ? {
                ...item,
                status: overColumn.id,
              }
            : item,
        ),
      );
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((item) => item.id === active.id);
    if (!activeItem) return;

    // Find the indices for reordering
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Board</h2>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900">Custom tags</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">Sort by Votes ▼</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create</button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              items={items.filter((item) => item.status === column.id)}
            />
          ))}
        </div>

        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              {activeItem ? (
                <KanbanItem
                  id={activeItem.id}
                  title={activeItem.title}
                  description={activeItem.description}
                  votes={activeItem.votes}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
}
