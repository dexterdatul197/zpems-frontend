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
import { ExpenseReportForm } from "./ExpenseReportForm";
import { toast } from "sonner";

import { createExpenseReport } from "@/api/expenseReports";

export const ADD_EXPENSE_REPORT_DIALOG_ID = "add_expenseReport";
export const ADD_EXPENSE_REPORT_FORM_ID = "add_expenseReport_form";

export function AddExpenseReportDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(ADD_EXPENSE_REPORT_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: ADD_EXPENSE_REPORT_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(
    selectDialogOpen(ADD_EXPENSE_REPORT_DIALOG_ID)
  );

  const formRef = useRef(null);

  const handleAdd = async (data) => {
    try {
      await createExpenseReport(data);

      queryClient.invalidateQueries(["expenseReports"]);
      handleClose();
      toast.success("Expense Report created");
    } catch (error) {
      console.error(error);
      toast.error("Error creating expense report");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: ADD_EXPENSE_REPORT_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: ADD_EXPENSE_REPORT_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New ExpenseReport</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <ExpenseReportForm
            onSubmit={handleAdd}
            initialValues={{}}
            ref={formRef}
          />
        </div>
        <SheetFooter>
          <Button onClick={() => formRef?.current?.submit()}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
