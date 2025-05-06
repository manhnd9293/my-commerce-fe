import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useRef, useState } from "react";
import { Loader, LoaderCircle, UploadIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "@/services/media.service.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { cn } from "@/lib/utils.ts";
import { Asset } from "@/dto/asset.ts";

type MediaModalProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  initialSelectedIds: string[];
  productId: string | undefined;
  onUpdate: (item: Asset[]) => void;
};

function MediaModal({
  open,
  setOpen,
  initialSelectedIds,
  onUpdate,
}: MediaModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileIds, setSelectedFileIds] =
    useState<string[]>(initialSelectedIds);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["Assets"],
    queryFn: MediaService.getAllFiles,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: MediaService.uploadFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Assets"],
      });
    },
  });

  const hasChanged =
    structuredClone(initialSelectedIds).sort().join("-") !==
    structuredClone(selectedFileIds).sort().join("-");

  async function handleChangeSelectedAssetIds() {
    if (!hasChanged) {
      return;
    }
    const updateIds = [
      ...initialSelectedIds.filter((id) => selectedFileIds.includes(id)),
      ...selectedFileIds.filter((id) => !initialSelectedIds.includes(id)),
    ];

    const idToAsset = data!.reduce<Map<string, Asset>>((map, asset) => {
      map.set(asset.id, asset);
      return map;
    }, new Map<string, Asset>());
    onUpdate(updateIds.map((id) => idToAsset.get(id)!));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={"max-w-[900px]"}>
        <DialogHeader>
          <DialogTitle className={"font-semibold"}>Select Files</DialogTitle>
        </DialogHeader>
        <div className={"max-h-[600px] overflow-y-auto"}>
          <div
            className={
              "border border-gray-400 rounded-md border-dashed h-24 flex flex-col justify-center items-center"
            }
          >
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => fileInputRef.current!.click()}
              className={
                "flex justify-center items-center gap-2 shadow-sm rounded-full"
              }
            >
              {!isPending && (
                <>
                  <UploadIcon className={"size-4"} />
                  <span className={"text-sm font-normal"}>Upload media</span>
                </>
              )}
              {isPending && (
                <>
                  <LoaderCircle className={"size-4 animate-spin"} />
                  <span className={"text-sm font-normal"}>
                    Uploading files ...
                  </span>
                </>
              )}
            </Button>
            <span className={"text-sm text-gray-400 mt-2"}>
              Drag and drop images and videos and files
            </span>
            <Input
              ref={fileInputRef}
              placeholder="Product"
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              onChange={async (event) => {
                const addedFiles = event.target.files;
                if (!addedFiles) {
                  return;
                }
                await mutateAsync(addedFiles);
              }}
            />
          </div>
          {isLoading && (
            <div className={"flex flex-col items-center"}>
              <Loader className={"animate-spin"} />
              <span>Loading files ...</span>
            </div>
          )}
          {data && data.length > 0 && (
            <div className={"mt-6 grid grid-cols-6 gap-4"}>
              {data.map((file) => {
                return (
                  <div
                    key={`k-${file.id}`}
                    className={cn(
                      "py-4 rounded-md shadow-sm hover:bg-gray-200 flex-col flex items-center",
                      {
                        "bg-gray-200": selectedFileIds.includes(file.id),
                      },
                    )}
                  >
                    <div
                      className={cn(
                        "mx-auto w-[80%] rounded-md flex justify-center relative",
                      )}
                    >
                      <Checkbox
                        className={
                          "accent-white absolute top-1 left-1 bg-white"
                        }
                        checked={selectedFileIds.includes(file.id)}
                        onCheckedChange={(v) => {
                          if (v) {
                            const newFileIds = [...selectedFileIds, file.id];
                            setSelectedFileIds(newFileIds);
                          } else {
                            setSelectedFileIds((list) =>
                              list.filter((id) => id !== file.id),
                            );
                          }
                        }}
                      />
                      <img
                        className={
                          "aspect-square object-cover object-center rounded-md"
                        }
                        src={file.preSignUrl}
                      />
                    </div>

                    <div className={"mt-2"}>
                      <div
                        className={"line-clamp-1 text-sm text-left"}
                      >{`${file.id.split("-")[4]}`}</div>
                      <div className={"text-sm text-gray-500"}>
                        {file.fileType}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={"flex justify-center items-center gap-2"}
            size={"sm"}
            disabled={!hasChanged}
            onClick={handleChangeSelectedAssetIds}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MediaModal;
