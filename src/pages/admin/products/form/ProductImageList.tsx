import React, { MouseEvent, useState } from "react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import MediaModal from "@/pages/admin/products/MediaModal.tsx";
import { cn } from "@/lib/utils.ts";
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
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Asset } from "@/dto/asset.ts";
import ImageItem from "@/pages/admin/products/form/ImageItem.tsx";
import DraggableItem from "@/pages/admin/products/form/DraggableItem.tsx";
import { FormLabel } from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

interface ProductImageListProps {
  initialValues?: {
    id: string;
    assetId: string;
    asset: {
      id: string;
      preSignUrl?: string;
    };
  }[];
  productId: string | undefined;
  onUpdateMedia: (assetIds: string[]) => Promise<void>;
  onDeleteMedia: (assetIds: string[]) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

function ProductImageList({
  initialValues,
  productId,
  onUpdateMedia,
  onDeleteMedia,
  isUpdating,
  isDeleting,
}: ProductImageListProps) {
  const [mediaFiles, setMediaFiles] = useState(
    initialValues ? initialValues.map((v) => v.asset) : [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  function handleDragStart(e: DragStartEvent) {
    const id = e.active.id;
    setActiveId(String(id));
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    const overId = over?.id;
    const activeId = active.id;
    setActiveId(null);
    if (!overId || activeId === overId) {
      return;
    }
    const oldIndex = mediaFiles.findIndex((file) => file.id === activeId);
    const newIndex = mediaFiles.findIndex((file) => file.id === overId);
    const newFileList = arrayMove(mediaFiles, oldIndex, newIndex);
    setMediaFiles(newFileList);
    await onUpdateMedia(newFileList.map((asset) => asset.id));
    if (productId) {
      toast.success("Media order saved", {
        position: "bottom-center",
        closeButton: true,
      });
    }
  }

  const activeFile = activeId
    ? mediaFiles.find((file) => file.id === activeId)
    : null;

  //todo: handle images empty or null

  async function handleUpdateMedia(assetIds: Asset[]) {
    setMediaFiles(
      assetIds.map((asset) => ({
        id: asset.id,
        preSignUrl: asset.preSignUrl,
      })),
    );
    await onUpdateMedia(assetIds.map((asset) => asset.id));
  }

  function handleCheckChange(
    value: boolean | "indeterminate",
    assetId: string,
  ) {
    if (value) {
      setSelectedIds([...selectedIds, assetId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== assetId));
    }
  }

  const hasSelectedItem = selectedIds.length > 0;

  async function handleDeleteMedia(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await onDeleteMedia(selectedIds);
    setSelectedIds([]);
    setMediaFiles((prev) =>
      prev.filter((file) => !selectedIds.includes(file.id)),
    );
  }

  return (
    <>
      <div className={"mt-4 mb-2 h-6 flex justify-between items-center"}>
        {!hasSelectedItem && (
          <FormLabel className={"font-semibold "}>Product media</FormLabel>
        )}
        {hasSelectedItem && (
          <div className={"flex items-center gap-2"}>
            <Checkbox
              checked={
                hasSelectedItem
                  ? selectedIds.length === mediaFiles.length
                    ? true
                    : "indeterminate"
                  : false
              }
              onCheckedChange={(v) => {
                if (v) {
                  setSelectedIds(mediaFiles.map((file) => file.id));
                } else {
                  setSelectedIds([]);
                }
              }}
            />
            <span>
              {selectedIds.length} file{selectedIds.length > 1 && "s"} selected
            </span>
          </div>
        )}
        {hasSelectedItem && (
          <Button
            variant={"ghost"}
            size={"sm"}
            className={"text-red-700 hover:text-red-600"}
            onClick={handleDeleteMedia}
          >
            {!isDeleting && <span>Remove</span>}
            {isDeleting && <LoaderCircle className={"size-4 animate-spin"} />}
          </Button>
        )}
      </div>
      <DndContext
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
        sensors={sensors}
      >
        <div className={"grid grid-cols-6 gap-2"}>
          <SortableContext items={mediaFiles} strategy={rectSortingStrategy}>
            {mediaFiles.map((file, index) => {
              if (selectedIds.length === 0) {
                return (
                  <DraggableItem
                    className={cn(
                      "aspect-square shadow-lg relative ring-1 ring-gray-200 rounded-md origin-top-left",
                      {
                        "col-span-2 row-span-2": index === 0,
                      },
                    )}
                    key={file.id}
                    id={file.id}
                  >
                    {activeId !== file.id ? (
                      <ImageItem
                        assetId={file.id}
                        url={file.preSignUrl!}
                        checkBox
                        selected={selectedIds.includes(file.id)}
                        onCheckChange={handleCheckChange}
                      />
                    ) : (
                      <div
                        className={
                          "w-full aspect-square bg-gray-200 rounded-md"
                        }
                      />
                    )}
                  </DraggableItem>
                );
              } else {
                return (
                  <div
                    className={cn(
                      "aspect-square shadow-lg relative ring-1 ring-gray-200 rounded-md origin-top-left select-none",
                      {
                        "col-span-2 row-span-2": index === 0,
                      },
                    )}
                    key={file.id}
                    id={file.id}
                  >
                    <ImageItem
                      assetId={file.id}
                      url={file.preSignUrl!}
                      checkBox
                      selected={selectedIds.includes(file.id)}
                      onCheckChange={handleCheckChange}
                    />
                  </div>
                );
              }
            })}
          </SortableContext>
          <DragOverlay adjustScale={true}>
            {activeId ? (
              <ImageItem
                overlay
                assetId={activeId}
                url={activeFile!.preSignUrl!}
              />
            ) : null}
          </DragOverlay>
          <div
            className={
              "bg-gray-200 aspect-square flex items-center justify-center cursor-pointer rounded-md"
            }
            onClick={() => setShowMediaModal(true)}
          >
            <PlusIcon className={"size-6 text-gray-500"} />
          </div>
        </div>
      </DndContext>

      <MediaModal
        open={showMediaModal}
        setOpen={setShowMediaModal}
        productId={productId}
        initialSelectedIds={mediaFiles.map((file) => file.id)}
        onUpdate={handleUpdateMedia}
      />
    </>
  );
}

export default ProductImageList;
