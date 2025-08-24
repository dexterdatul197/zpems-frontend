// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { ChevronsLeftIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import {
  selectDialogData,
  selectDialogOpen,
  setDialogOpen,
} from "@/redux/slices/dialogs";
import { selectFormState, FormState, setFormState } from "@/redux/slices/forms";
import { ExpenseForm } from "./ExpenseForm";
import { toast } from "sonner";

import { updateExpense } from "@/api/expenses";
import { uploadFile } from "@/api/files";

export const EDIT_EXPENSE_DIALOG_ID = "edit_expense";
export const EDIT_EXPENSE_FORM_ID = "edit_expense_form";

export function EditExpenseDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const formState = useSelector(selectFormState(EDIT_EXPENSE_FORM_ID));

  useEffect(() => {
    dispatch(
      setFormState({
        id: EDIT_EXPENSE_FORM_ID,
        formState: FormState.Ready,
      })
    );
  }, []);

  const open: boolean = useSelector(selectDialogOpen(EDIT_EXPENSE_DIALOG_ID));
  const dialogData = useSelector(selectDialogData(EDIT_EXPENSE_DIALOG_ID));
  const expense = dialogData?.expense;

  const formRef = useRef(null);

  const handleEdit = async (data) => {
    dispatch(
      setFormState({
        id: EDIT_EXPENSE_FORM_ID,
        formState: FormState.Submititng,
      })
    );

    try {
      const { receiptFile } = data;
      if (typeof receiptFile !== "string") {
        try {
          const uploadedFile: any = await uploadFile(receiptFile);
          data = { ...data, receiptFile: uploadedFile?.fileUrl };
        } catch (error) {
          console.log(error);
          toast.error("Error uploading receipt image");
          // return;
        }
      }

      await updateExpense(expense._id, data);

      queryClient.invalidateQueries(["expenses"]);
      handleClose();
      toast.success("Expense updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating expense");
    }

    dispatch(
      setFormState({
        id: EDIT_EXPENSE_FORM_ID,
        formState: FormState.Ready,
      })
    );
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: EDIT_EXPENSE_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: EDIT_EXPENSE_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Expense</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {expense && (
            <ExpenseForm
              onSubmit={handleEdit}
              initialValues={{
                ...expense,
                category: expense.category.internalId,
              }}
              ref={formRef}
            />
          )}
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
}
