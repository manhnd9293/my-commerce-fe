import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

type DraggableItemProps = {
  children: ReactNode;
  id: string;
  className?: string;
};



function DraggableItem({ children, id, className }: DraggableItemProps) {
  const { setNodeRef, transform, transition, listeners, attributes } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

export default DraggableItem;
