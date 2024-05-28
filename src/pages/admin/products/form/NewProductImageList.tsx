import {XIcon} from "lucide-react";

interface NewProductImageListProps {
  onDelete: (imageId: number)=> void,
  imageFiles: FileList
}

function OldProductImageList({onDelete, imageFiles}: NewProductImageListProps) {

  return (
    imageFiles && Array.from(imageFiles).map((imageFile, index) => (
      <div className={'shadow-md relative'} key={index}>
        <XIcon className={'size-4 right-1 top-1 absolute hover:cursor-pointer'}
               onClick={() => {
                 onDelete(index);
               }}
        />
        <img className={'h-52 w-full rounded-sm'}
             src={URL.createObjectURL(new Blob([imageFile]))}/>
      </div>
    ))
  );
}

export default OldProductImageList;