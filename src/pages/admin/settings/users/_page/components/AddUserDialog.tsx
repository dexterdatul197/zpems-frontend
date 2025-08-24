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
import { UserForm } from "./UserForm";
import { toast } from "sonner";

import { createUser } from "@/api/users";

export const ADD_USER_DIALOG_ID = "add_user";
export const ADD_USER_FORM_ID = "add_user_form";

export function AddUserDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const formState = useSelector(selectFormState(ADD_USER_FORM_ID));

  // useEffect(() => {
  //   dispatch(
  //     setFormState({
  //       id: ADD_USER_FORM_ID,
  //       formState: FormState.Ready,
  //     })
  //   );
  // }, []);

  const open: boolean = useSelector(selectDialogOpen(ADD_USER_DIALOG_ID));

  const formRef = useRef(null);

  const handleAdd = async (data) => {
    try {
      await createUser({ ...data, password: "123qweasd" });

      queryClient.invalidateQueries(["users"]);
      handleClose();
      toast.success("User created");
    } catch (error) {
      console.error(error);
      toast.error("Error creating user");
    }
  };

  const handleClose = () =>
    dispatch(setDialogOpen({ id: ADD_USER_DIALOG_ID, open: false }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) =>
        dispatch(setDialogOpen({ id: ADD_USER_DIALOG_ID, open }))
      }
    >
      <SheetContent className="w-[800px] !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>New User</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <UserForm onSubmit={handleAdd} initialValues={{}} ref={formRef} />
        </div>
        <SheetFooter>
          <Button onClick={() => formRef?.current?.submit()}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
