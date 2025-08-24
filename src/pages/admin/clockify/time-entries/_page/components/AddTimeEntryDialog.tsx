// @ts-nocheck
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

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
import { createTimeEntry } from "@/api/clockify/timeEntries";
import { useQueryClient } from "@tanstack/react-query";

export const ADD_TIME_ENTRY_DIALOG = "add_time_entry_dialog";
export const ADD_TIME_ENTRY_FORM = "add_time_entry_form";

export const AddTimeEntryDialog = () => {
  const queryClient = useQueryClient();

  useDialogStore();
  useFormStore();

  useEffect(() => {
    formActions.setFormState(ADD_TIME_ENTRY_FORM, FormState.Ready);
  }, []);

  const handleSave = async (values) => {
    formActions.setFormState(ADD_TIME_ENTRY_FORM, FormState.Submititng);

    try {
      await createTimeEntry(values);

      dialogActions.closeDialog(ADD_TIME_ENTRY_DIALOG);
      toast.success("Time entry added successfully!");
      queryClient.invalidateQueries("clockifyTimeEntries");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add time entry");
    }

    formActions.setFormState(ADD_TIME_ENTRY_FORM, FormState.Ready);
  };

  const formRef = useRef(null);
  const formState = formActions.getFormState(ADD_TIME_ENTRY_FORM);

  return (
    <Sheet
      open={dialogActions.isDialogOpen(ADD_TIME_ENTRY_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          dialogActions.closeDialog(ADD_TIME_ENTRY_DIALOG);
        }
      }}
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New Time Entry</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <TimeEntryForm
            onSubmit={handleSave}
            ref={formRef}
            initialValues={dialogActions.getDialogData(ADD_TIME_ENTRY_DIALOG)}
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
