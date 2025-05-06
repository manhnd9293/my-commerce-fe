import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { cn } from "@/lib/utils.ts";

type ImageItemProps = {
  assetId: string;
  url: string;
  overlay?: boolean;
  checkBox?: boolean;
  selected?: boolean;
  onCheckChange?: (v: boolean | "indeterminate", id: string) => void;
};

function ImageItem({
  assetId,
  url,
  overlay,
  selected,
  onCheckChange,
}: ImageItemProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={"relative"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {onCheckChange && (hover || selected) && (
        <Checkbox
          className={"absolute top-1 left-1 bg-white z-20"}
          checked={selected}
          onCheckedChange={(checked) => onCheckChange(checked, assetId)}
        />
      )}
      {!overlay && (
        <div
          className={cn("absolute inset-0 z-10", {
            "bg-black opacity-20": hover && !selected,
            "bg-gray-400 opacity-50": selected,
          })}
        />
      )}

      <img
        className={
          "w-full aspect-square rounded-sm object-center object-cover origin-top-left"
        }
        src={url}
      />
    </div>
  );
}

export default ImageItem;
