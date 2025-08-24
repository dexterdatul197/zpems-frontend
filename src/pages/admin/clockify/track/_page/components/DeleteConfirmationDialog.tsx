import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDialogStore } from "@/zustand/useDialogStore";

export const DELETE_CONFIRMATION_DIALOG = "delete_confirmation_dialog";

export const DeleteConfirmationDialog = ({ onConfirm, title }: any) => {
  const { selectDialogOpen, selectDialogData, closeDialog }: any =
    useDialogStore();

  return (
    <AlertDialog
      open={selectDialogOpen(DELETE_CONFIRMATION_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog(DELETE_CONFIRMATION_DIALOG);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              onConfirm(selectDialogData(DELETE_CONFIRMATION_DIALOG))
            }
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
