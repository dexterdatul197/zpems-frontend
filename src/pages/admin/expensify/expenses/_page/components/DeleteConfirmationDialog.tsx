import { useSelector, useDispatch } from "react-redux";
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

import {
  selectDialogOpen,
  setDialogOpen,
  selectDialogData,
} from "@/redux/slices/dialogs";

export const DELETE_CONFIRMATION_DIALOG = "delete_confirmation_dialog";

export const DeleteConfirmationDialog = ({ onConfirm, title }: any) => {
  const dispatch = useDispatch();
  const open: boolean = useSelector(
    selectDialogOpen(DELETE_CONFIRMATION_DIALOG)
  );

  const dialogData = useSelector(selectDialogData(DELETE_CONFIRMATION_DIALOG));

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: DELETE_CONFIRMATION_DIALOG, open }))
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(dialogData)}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
