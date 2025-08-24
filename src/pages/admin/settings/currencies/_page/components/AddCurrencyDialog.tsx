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
import { CurrencyForm } from "./CurrencyForm";
import { toast } from "sonner";

import { createCurrency } from "@/api/currencies";

export const ADD_CURRENCY_DIALOG_ID = "add_currency";
export const ADD_CURRENCY_FORM_ID = "add_currency_form";

export function AddCurrencyDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(ADD_CURRENCY_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: ADD_CURRENCY_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(selectDialogOpen(ADD_CURRENCY_DIALOG_ID));

  const formRef = useRef(null);

  const handleAdd = async (data) => {
    try {
      await createCurrency({ ...data });

      queryClient.invalidateQueries(["currencies"]);
      handleClose();
      toast.success("Currency created");
    } catch (error) {
      console.error(error);
      toast.error("Error creating currency");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: ADD_CURRENCY_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: ADD_CURRENCY_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New Currency</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <CurrencyForm onSubmit={handleAdd} initialValues={{}} ref={formRef} />
        </div>
        <SheetFooter>
          <Button onClick={() => formRef?.current?.submit()}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
