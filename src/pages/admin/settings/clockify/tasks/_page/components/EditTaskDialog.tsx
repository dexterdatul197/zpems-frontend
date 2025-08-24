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

import { TaskForm } from "./TaskForm";
import { updateTask } from "@/api/clockify/tasks";

export const EDIT_TASK_DIALOG = "edit_task_dialog";
export const EDIT_TASK_FORM = "edit_task_form";

export const EditTaskDialog = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  useDialogStore();
  const { formState } = useFormStore(formActions.formSelector(EDIT_TASK_FORM));

  useEffect(() => {
    formActions.setFormState(EDIT_TASK_FORM, FormState.Ready);
  }, []);

  const handleSave = async (values) => {
    formActions.setFormState(EDIT_TASK_FORM, FormState.Submititng);

    try {
      const id = dialogActions.getDialogData(EDIT_TASK_DIALOG)._id;
      await updateTask(id, values);

      dialogActions.closeDialog(EDIT_TASK_DIALOG);
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries("clockifyTasksSetting");
    } catch (error) {
      toast.error("Failed to update task");
    }

    formActions.setFormState(EDIT_TASK_FORM, FormState.Ready);
  };

  return (
    <Sheet
      open={dialogActions.isDialogOpen(EDIT_TASK_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          dialogActions.closeDialog(EDIT_TASK_DIALOG);
        }
      }}
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <TaskForm
            onSubmit={handleSave}
            ref={formRef}
            initialValues={dialogActions.getDialogData(EDIT_TASK_DIALOG)}
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
