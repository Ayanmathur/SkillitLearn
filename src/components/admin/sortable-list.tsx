"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderItems } from "@/app/(main)/admin/actions/reorder-actions";

interface SortableItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface Props {
  items: SortableItem[];
  table: "paths" | "skills" | "modules" | "steps" | "quizQuestions";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  editHref?: (id: string) => string;
}

function SortableRow({
  item,
  onEdit,
  onDelete,
  editHref,
}: {
  item: SortableItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  editHref?: (id: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-surface-raised rounded-xl p-3 border border-[var(--border-color)] shadow-sm
                  ${isDragging ? "shadow-lg ring-2 ring-accent/30" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text-secondary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-text-primary truncate">{item.label}</div>
        {item.sublabel && <div className="text-xs text-text-muted">{item.sublabel}</div>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {editHref ? (
          <a href={editHref(item.id)} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">
            Edit
          </a>
        ) : onEdit ? (
          <button onClick={() => onEdit(item.id)} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">
            Edit
          </button>
        ) : null}
        {onDelete && (
          <button onClick={() => onDelete(item.id)} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function SortableList({ items: initialItems, table, onEdit, onDelete, editHref }: Props) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    setSaving(true);
    await reorderItems({
      table,
      items: reordered.map((item, i) => ({ id: item.id, orderIndex: i })),
    });
    setSaving(false);
  }

  return (
    <div className="relative">
      {saving && (
        <div className="absolute top-0 right-0 text-xs text-accent font-medium animate-pulse">
          Saving order...
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} editHref={editHref} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {items.length === 0 && (
        <p className="text-center text-text-muted py-6 text-sm">No items yet. Create one above.</p>
      )}
    </div>
  );
}
