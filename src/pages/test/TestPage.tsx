import PageTitle from "@/pages/common/PageTitle.tsx";
import { ReactNode, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils.ts";

const images = [
  "https://t4.ftcdn.net/jpg/01/91/14/97/360_F_191149799_KlEyWuZvvK1hThb0ayp0vd0Ei7ELZVej.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTddh5KSjMVRt-ZUeLxxHVrwgvFlcSJIjuxjw&s",
  "https://cdn.pixabay.com/photo/2016/04/26/16/58/coffe-1354786_1280.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5cpzgOFDWEjUBJj6X3Sp0TylR7JoFwBF5yQ&s",
  "https://media.istockphoto.com/id/1358132613/photo/refreshing-hot-cup-of-coffee-at-a-cafe.jpg?s=612x612&w=0&k=20&c=ObwIF28Vt3k93Nch9U4QYUdOwMA_eiMwVVCvKbypnNc=",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-yPG6LRX6bbhAPqRO4Veu__2WDmEIomm4TtRO8E5LOgY7ixwpP-auB50csVwwMWNJSos&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgMSK1cFiJYlvQXRjrC234P9VUV85Ii88MM-ZZfMxDZ1i0vX_xp-GF_HCf1wzqVMwVSkw&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBavcG4_ZVD5lqT10pkHkRNYgbdQ3CmNg6ozOGbu6Uoql6Z6YmRGmL7s-B_EGKVCedtfg&usqp=CAU",
];

type ImageItem = {
  id: string;
  url: string;
};

const initItems = images.map((item, index) => ({
  id: String(index + 1),
  url: item,
}));

function TestPage() {
  const [listImages, setListImages] = useState<ImageItem[]>(initItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragStart(event: DragStartEvent) {
    const active = event.active;
    setActiveId(active?.id);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { id: activeId } = event.active;
    const overId = event.over?.id;
    setActiveId(null);

    if (!overId || activeId === overId) {
      return;
    }
    const overIndex = listImages.findIndex((item) => item.id === overId);
    const activeIndex = listImages.findIndex((item) => item.id === activeId);

    setListImages((list) => {
      return arrayMove(list, activeIndex, overIndex);
    });
  }

  const activeItem = activeId
    ? listImages.find((item) => item.id === activeId)
    : null;

  return (
    <div>
      <PageTitle>Test</PageTitle>
      <div className={"w-[600px] bg-white mx-auto p-2"}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCorners}
        >
          <SortableContext
            items={listImages}
            id={"img-ctx"}
            strategy={rectSortingStrategy}
          >
            <div className={"grid grid-cols-6 gap-1"}>
              {listImages.map((image, index) => {
                return (
                  <SortableItem
                    id={image.id}
                    key={image.id}
                    className={cn(
                      "aspect-square bg-gray-200 rounded-md origin-top-left",
                      {
                        "col-span-2 row-span-2": index === 0,
                      },
                    )}
                  >
                    <div className={"flex relative"}>
                      <span className={"text-white left-2 absolute"}>
                        {image.id}
                      </span>
                      {activeId !== image.id ? (
                        <img
                          className={
                            "w-full aspect-square object-center object-cover rounded-md"
                          }
                          src={image.url}
                        />
                      ) : null}
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={true}>
            {activeId !== null ? (
              <div className={cn("aspect-square bg-gray-200 rounded-md")}>
                <img
                  className={
                    "w-full aspect-square object-center object-cover rounded-md"
                  }
                  src={activeItem?.url}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

type DragItemProp = {
  id: string;
  className: string;
  children: ReactNode;
};

function SortableItem({ id, children, className }: DragItemProp) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    // transform: transform ? CSS.Translate.toString(transform) : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={className}
    >
      {children}
    </div>
  );
}

export default TestPage;
