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
import { CategoryForm } from "./CategoryForm";
import { toast } from "sonner";

import { updateCategory } from "@/api/categories";

export const EDIT_CATEGORY_DIALOG_ID = "edit_category";
export const EDIT_CATEGORY_FORM_ID = "edit_category_form";

export function EditCategoryDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(EDIT_CATEGORY_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: EDIT_CATEGORY_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(selectDialogOpen(EDIT_CATEGORY_DIALOG_ID));
  const dialogData = useSelector(selectDialogData(EDIT_CATEGORY_DIALOG_ID));
  const category = dialogData?.category;

  const formRef = useRef(null);

  const handleEdit = async (data) => {
    try {
      console.log(category);
      await updateCategory(category._id, data);

      queryClient.invalidateQueries(["categories"]);
      handleClose();
      toast.success("Category updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating category");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: EDIT_CATEGORY_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: EDIT_CATEGORY_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {category && (
            <CategoryForm
              onSubmit={handleEdit}
              initialValues={category}
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
