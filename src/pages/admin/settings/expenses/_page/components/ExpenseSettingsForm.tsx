//@ts-nocheck

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  expenseSettings: z.any(),
});

interface ExpenseSettingsForm {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const ExpenseSettingsForm = forwardRef(
  ({ initialValues, onSubmit }: ExpenseSettingsForm, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        expenseSettings: initialValues?.expenseSettings ?? {
          maxExpenseAmount: 25000,
          receiptRequiredAmount: 75,
        },
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <InputField
              name="expenseSettings.maxExpenseAmount"
              label="Max Expense Amount"
            />
            <InputField
              name="expenseSettings.receiptRequiredAmount"
              label="Receipt RequiredAmount"
            />
          </div>

          <Button>Update</Button>
        </form>
      </Form>
    );
  }
);
