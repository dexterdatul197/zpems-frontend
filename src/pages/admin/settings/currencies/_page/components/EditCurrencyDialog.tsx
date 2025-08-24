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
import { CurrencyForm } from "./CurrencyForm";
import { toast } from "sonner";

import { updateCurrency } from "@/api/currencies";

export const EDIT_CURRENCY_DIALOG_ID = "edit_currency";
export const EDIT_CURRENCY_FORM_ID = "edit_currency_form";

export function EditCurrencyDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(EDIT_CURRENCY_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: EDIT_CURRENCY_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(selectDialogOpen(EDIT_CURRENCY_DIALOG_ID));
  const dialogData = useSelector(selectDialogData(EDIT_CURRENCY_DIALOG_ID));
  const currency = dialogData?.currency;

  const formRef = useRef(null);

  const handleEdit = async (data) => {
    try {
      console.log(currency);
      await updateCurrency(currency._id, data);

      queryClient.invalidateQueries(["currencies"]);
      handleClose();
      toast.success("Currency updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating currency");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: EDIT_CURRENCY_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: EDIT_CURRENCY_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Currency</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {currency && (
            <CurrencyForm
              onSubmit={handleEdit}
              initialValues={currency}
              ref={formRef}
            />
          )}
        </div>
        <SheetFooter>
          <Button onClick={() => formRef?.current?.submit()}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
