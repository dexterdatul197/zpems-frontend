//@ts-nocheck

import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  selectDialogData,
  selectDialogOpen,
  setDialogOpen,
} from "@/redux/slices/dialogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const EXPENSES_GROUP_DIALOG_ID = "expensesGroup";

export function ExpensesGroupDialog() {
  const dispatch = useDispatch();

  const open: boolean = useSelector(selectDialogOpen(EXPENSES_GROUP_DIALOG_ID));
  const dialogData = useSelector(selectDialogData(EXPENSES_GROUP_DIALOG_ID));

  const expenses = dialogData?.expenses ?? [];

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: EXPENSES_GROUP_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Category - {dialogData?.id}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.merchantName}</TableCell>
                  <TableCell>
                    {moment(expense.date).format("MM-DD-YYYY")}
                  </TableCell>
                  <TableCell>
                    {expense.total} {expense.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
