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

import { selectDialogOpen, setDialogOpen } from "@/redux/slices/dialogs";
import { selectFormState, FormState, setFormState } from "@/redux/slices/forms";
import { ExpenseForm } from "./ExpenseForm";
import { toast } from "sonner";

import { createExpense } from "@/api/expenses";
import { uploadFile } from "@/api/files";

export const ADD_EXPENSE_DIALOG_ID = "add_expense";
export const ADD_EXPENSE_FORM_ID = "add_expense_form";

export function AddExpenseDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const formState = useSelector(selectFormState(ADD_EXPENSE_FORM_ID));

  useEffect(() => {
    dispatch(
      setFormState({
        id: ADD_EXPENSE_FORM_ID,
        formState: FormState.Ready,
      })
    );
  }, []);

  const open: boolean = useSelector(selectDialogOpen(ADD_EXPENSE_DIALOG_ID));

  const formRef = useRef(null);

  const handleAdd = async (data) => {
    dispatch(
      setFormState({
        id: ADD_EXPENSE_FORM_ID,
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

      await createExpense(data);

      queryClient.invalidateQueries(["expenses"]);
      handleClose();
      toast.success("Expense created");
    } catch (error) {
      console.error(error);
      toast.error("Error creating expense");
    }

    dispatch(
      setFormState({
        id: ADD_EXPENSE_FORM_ID,
        formState: FormState.Ready,
      })
    );
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: ADD_EXPENSE_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: ADD_EXPENSE_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New Expense</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <ExpenseForm onSubmit={handleAdd} initialValues={{}} ref={formRef} />
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
