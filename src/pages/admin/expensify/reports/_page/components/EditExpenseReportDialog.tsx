//@ts-nocheck

import React, { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { ChevronsLeftIcon, Loader2Icon } from "lucide-react";
import moment from "moment-timezone";

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  selectDialogData,
  selectDialogOpen,
  setDialogOpen,
} from "@/redux/slices/dialogs";
import { selectFormState, FormState, setFormState } from "@/redux/slices/forms";
import { ExpenseReportForm } from "./ExpenseReportForm";
import { toast } from "sonner";

import { updateExpenseReport } from "@/api/expenseReports";
import { formatPrice } from "@/lib/utils";

export const EDIT_EXPENSE_REPORT_DIALOG_ID = "edit_expenseReport";
export const EDIT_EXPENSE_REPORT_FORM_ID = "edit_expenseReport_form";

export function EditExpenseReportDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(EDIT_EXPENSE_REPORT_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: EDIT_EXPENSE_REPORT_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(
    selectDialogOpen(EDIT_EXPENSE_REPORT_DIALOG_ID)
  );
  const dialogData = useSelector(
    selectDialogData(EDIT_EXPENSE_REPORT_DIALOG_ID)
  );
  const expenseReport = dialogData?.expenseReport;

  const formRef = useRef(null);

  const handleEdit = async (data) => {
    try {
      await updateExpenseReport(expenseReport._id, data);

      queryClient.invalidateQueries(["expenseReports"]);
      handleClose();
      toast.success("ExpenseReport updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating expenseReport");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: EDIT_EXPENSE_REPORT_DIALOG_ID, open: false }));

  const total = expenseReport?.expenses?.reduce(
    (acc, expense) => acc + expense.total,
    0
  );

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: EDIT_EXPENSE_REPORT_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit ExpenseReport</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {expenseReport && (
            <ExpenseReportForm
              onSubmit={handleEdit}
              initialValues={expenseReport}
              ref={formRef}
            />
          )}
        </div>
        <SheetFooter>
          <Button onClick={() => formRef?.current?.submit()}>Save</Button>
        </SheetFooter>

        <div className="mt-10">
          <Table>
            {/* <TableCaption>A list of your expenses.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Merchant Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseReport?.expenses?.map((expense) => {
                return (
                  <TableRow key={expense._id}>
                    <TableCell className="font-medium">
                      {expense.merchantName}
                    </TableCell>
                    <TableCell>
                      {moment(expense.date).format("MM-DD-YYYY")}
                    </TableCell>
                    <TableCell>{expense.category?.name}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(expense.total)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">
                  {formatPrice(total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
