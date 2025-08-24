// @ts-nocheck
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useDialogStore, dialogActions } from "@/zustand/useDialogStore";
import { useFormStore, formActions, FormState } from "@/zustand/useFormStore";
import { TimeEntryForm } from "./TimeEntryForm";
import { updateTimeEntry } from "@/api/clockify/timeEntries";

export const EDIT_TIME_ENTRY_DIALOG = "edit_time_entry_dialog";
export const EDIT_TIME_ENTRY_FORM = "edit_time_entry_form";

export const EditTimeEntryDialog = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  useDialogStore();
  const { formState } = useFormStore(
    formActions.formSelector(EDIT_TIME_ENTRY_FORM)
  );
  //   const formState = formActions.getFormState(EDIT_TIME_ENTRY_FORM);

  useEffect(() => {
    formActions.setFormState(EDIT_TIME_ENTRY_FORM, FormState.Ready);
  }, []);

  const handleSave = async (values) => {
    formActions.setFormState(EDIT_TIME_ENTRY_FORM, FormState.Submititng);

    try {
      const id = dialogActions.getDialogData(EDIT_TIME_ENTRY_DIALOG)._id;
      await updateTimeEntry(id, values);

      dialogActions.closeDialog(EDIT_TIME_ENTRY_DIALOG);
      toast.success("Time entry updated successfully!");
      queryClient.invalidateQueries("clockifyTimeEntries");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update time entry");
    }

    formActions.setFormState(EDIT_TIME_ENTRY_FORM, FormState.Ready);
  };

  return (
    <Sheet
      open={dialogActions.isDialogOpen(EDIT_TIME_ENTRY_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          dialogActions.closeDialog(EDIT_TIME_ENTRY_DIALOG);
        }
      }}
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Time Entry</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <TimeEntryForm
            onSubmit={handleSave}
            ref={formRef}
            initialValues={dialogActions.getDialogData(EDIT_TIME_ENTRY_DIALOG)}
          />
        </div>
        <SheetFooter>
          <Button
            className="w-full"
            onClick={() => formRef?.current?.submit()}
            disabled={
              formState === FormState.Loading ||
              formState === FormState.Submititng
            }
          >
            {formState === FormState.Submititng && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
