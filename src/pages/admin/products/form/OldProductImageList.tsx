import {useState} from "react";
import {XIcon} from "lucide-react";

interface ProductImageListProps {
  onDelete: (imageId: number)=> void,
  initialValues?: {
    id: number,
    assetId: number,
    asset: {
      id: number,
      preSignUrl?: string
    }
  } []
}

function OldProductImageList({onDelete, initialValues}: ProductImageListProps) {
  const [images, setImages] = useState(initialValues);
  return (
    images && images.map((image) => (
      <div className={'shadow-md relative'} key={image.id}>
        <XIcon className={'size-4 right-1 top-1 absolute hover:cursor-pointer'}
               onClick={() => {
                 setImages(images?.filter(img => img.id !== image.id));
                 onDelete(image.id);
               }}
        />
        <img className={'h-52 w-full rounded-sm'}
             src={image.asset.preSignUrl}/>
      </div>
    ))
  );
}

export default OldProductImageList;