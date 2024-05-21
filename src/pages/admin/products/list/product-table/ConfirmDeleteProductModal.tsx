import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog.tsx';
import { ReactNode } from 'react';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

function ConfirmDeleteProductModal(props: {
  onConfirm: ()=> void,
  children?: ReactNode,
  open?: boolean,
  onOpenChange?: any
}) {
  return (
    <div>
      <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
        <AlertDialogTrigger asChild>
          {props.children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete categories?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={props.onConfirm} >Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default ConfirmDeleteProductModal;