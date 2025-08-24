import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { useDialogStore } from "@/zustand/useDialogStore";
import { useClockifyTrackStore } from "../zustand/useClockifyTrackStore";

export const EDIT_TIME_ENTRY_DESCRIPTION_DIALOG =
  "edit_time_entry_description_dialog";

export const EditTimeEntryDescriptionDialog = () => {
  const { updateLineTimesheetTimeEntry }: any = useClockifyTrackStore();

  const { selectDialogOpen, selectDialogData, closeDialog }: any =
    useDialogStore();

  const dialogData = selectDialogData(EDIT_TIME_ENTRY_DESCRIPTION_DIALOG);

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (dialogData) {
      const { lineTimesheet, date } = dialogData;
      setDescription(lineTimesheet?.timeEntries?.[date]?.description || "");
    }
  }, [dialogData]);

  const handleSave = async () => {
    const { lineTimesheet, date } = dialogData;

    await updateLineTimesheetTimeEntry(lineTimesheet, date, {
      description,
    });

    closeDialog(EDIT_TIME_ENTRY_DESCRIPTION_DIALOG);
    toast.success("Time entry description updated successfully!");
  };

  return (
    <Dialog
      open={selectDialogOpen(EDIT_TIME_ENTRY_DESCRIPTION_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog(EDIT_TIME_ENTRY_DESCRIPTION_DIALOG);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Time Entry Description</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder=""
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
