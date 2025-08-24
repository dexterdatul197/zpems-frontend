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

import { VendorForm } from "./VendorForm";
import { createVendor } from "@/api/sap/vendors";
import { useQueryClient } from "@tanstack/react-query";

export const ADD_VENDOR_DIALOG = "add_vendor_dialog";
export const ADD_VENDOR_FORM = "add_vendor_form";

export const AddVendorDialog = () => {
  const queryClient = useQueryClient();

  useDialogStore();
  useFormStore();

  useEffect(() => {
    formActions.setFormState(ADD_VENDOR_FORM, FormState.Ready);
  }, []);

  const handleSave = async (values) => {
    formActions.setFormState(ADD_VENDOR_FORM, FormState.Submititng);

    try {
      await createVendor(values);

      dialogActions.closeDialog(ADD_VENDOR_DIALOG);
      toast.success("Vendor added successfully!");
      queryClient.invalidateQueries("sapVendors");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add vendor");
    }

    formActions.setFormState(ADD_VENDOR_FORM, FormState.Ready);
  };

  const formRef = useRef(null);
  const formState = formActions.getFormState(ADD_VENDOR_FORM);

  return (
    <Sheet
      open={dialogActions.isDialogOpen(ADD_VENDOR_DIALOG)}
      onOpenChange={(open) => {
        if (!open) {
          dialogActions.closeDialog(ADD_VENDOR_DIALOG);
        }
      }}
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New Vendor</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <VendorForm
            onSubmit={handleSave}
            ref={formRef}
            initialValues={dialogActions.getDialogData(ADD_VENDOR_DIALOG)}
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
