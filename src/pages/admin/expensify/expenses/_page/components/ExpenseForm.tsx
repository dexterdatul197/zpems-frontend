//@ts-nocheck

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import moment from "moment-timezone";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { FancyMultiSelectField } from "@/components/fields/FancyMultiSelectField";
import { InputField } from "@/components/fields/InputField";
import { ComboboxField } from "@/components/fields/ComboboxField";
import { DropzoneField } from "@/components/fields/DropzoneField";
import { Button } from "@/components/ui/button";

import { uploadFile } from "@/api/files";
import { scanReceipt } from "@/api/expenses";
import { Loader2Icon } from "lucide-react";
import { getExpenseReports } from "@/api/expenseReports";
import { getActiveCategories } from "@/api/categories";
import { getUsers } from "@/api/users";
import { getSettings } from "@/api/settings";
import { getActiveCurrencies } from "@/api/currencies";

interface ExpenseFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const ExpenseForm = forwardRef(
  ({ initialValues, onSubmit }: ExpenseFormProps, ref) => {
    const { authUser } = useRouteLoaderData("root");

    const { data: settings } = useQuery({
      queryKey: ["settings"],
      queryFn: getSettings,
    });

    const formSchema = z.object({
      receiptFile: z.any(),
      merchantName: z.string().min(1),
      date: z.string().min(1), // TODO: better date validation
      total: z.coerce
        .number()
        .min(settings?.expenseSettings?.receiptRequiredAmount || 0.01)
        .max(settings?.expenseSettings?.maxExpenseAmount || 1000000),
      currency: z.string(),
      category: z.coerce.string().min(1),
      attendee: z.any(), // TODO: better validation
      description: z.string().optional(),
      expenseReportId: z.any(),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        receiptFile: initialValues?.receiptFile ?? "",
        merchantName: initialValues?.merchantName ?? "",
        date: initialValues?.date
          ? new Date(initialValues?.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        total: initialValues?.total ?? "",
        currency: initialValues?.currency ?? "USD",
        category: initialValues?.category ?? "",
        attendee: initialValues?.attendee ?? authUser.id,
        description: initialValues?.description ?? "",
        expenseReportId: initialValues?.expenseReportId ?? null,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    const { data: expenseReports } = useQuery({
      queryKey: ["expenseReports"],
      queryFn: async () => {
        const res = await getExpenseReports();
        return res.data;
      },
    });

    const { data: categories } = useQuery({
      queryKey: ["categories", "active"],
      queryFn: getActiveCategories,
    });

    const { data: currencies } = useQuery({
      queryKey: ["currencies", "active"],
      queryFn: getActiveCurrencies,
    });

    const { data: users, isLoading: isUsersLoading } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        if (authUser.role === "admin") {
          return await getUsers();
        } else {
          return [authUser];
        }
      },
    });

    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async () => {
      setIsScanning(true);
      let receiptFile = form.watch("receiptFile");

      //upload image
      if (typeof receiptFile !== "string") {
        try {
          const uploadedFile: any = await uploadFile(receiptFile);
          form.setValue("receiptFile", uploadedFile?.fileUrl);
        } catch (error) {
          console.log(error);
          setIsScanning(false);
          return;
        }
      }

      receiptFile = form.watch("receiptFile");
      if (receiptFile) {
        console.log("fileURL", receiptFile);

        try {
          const { result, expenseData } = await scanReceipt({ receiptFile });
          console.log("-----------Scan Receipt Result-----------");
          console.log(result);
          console.log(expenseData);

          const parsedExpenseData = JSON.parse(expenseData);
          console.log(parsedExpenseData);

          if (parsedExpenseData?.merchantName) {
            form.setValue("merchantName", parsedExpenseData?.merchantName);
          }
          if (parsedExpenseData?.date) {
            form.setValue(
              "date",
              moment(parsedExpenseData?.date).format("YYYY-MM-DD")
            );
          }
          if (parsedExpenseData?.total) {
            form.setValue("total", parsedExpenseData?.total);
          }
          if (parsedExpenseData?.currency) {
            const foundCurrency = currencies.find(
              (currency) => currency.symbol === parsedExpenseData?.currency
            );

            if (foundCurrency) {
              form.setValue("currency", foundCurrency.symbol);
            }
          }
          if (parsedExpenseData?.categoryId) {
            form.setValue("category", parsedExpenseData?.categoryId + "");
          }
        } catch (error) {
          console.log(error);
          toast.error("Error scanning receipt");
        }
      }
      setIsScanning(false);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="pb-4 flex flex-col space-y-2">
            <Label>Receipt Image</Label>
            <DropzoneField name="receiptFile" multiple={false} />
            {/* <InputField name="receiptFile" label="Receipt Image" /> */}
            <Button type="button" onClick={handleScan} disabled={isScanning}>
              {isScanning && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Scan
            </Button>
          </div>
          <div className="flex gap-2">
            <InputField
              name="merchantName"
              label="Merchant"
              className="w-[50%]"
            />
            <InputField
              name="date"
              label="Date"
              type="date"
              className="w-[50%]"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <ComboboxField
                name="category"
                label="Category"
                options={categories || []}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.internalId}
              />
            </div>
            <div className="flex-1 flex gap-2">
              <InputField name="total" label="Total" className="flex-1" />
              <ComboboxField
                name="currency"
                label="Currency"
                options={currencies || []}
                getOptionLabel={(option) => option.symbol}
                getOptionValue={(option) => option.symbol}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <ComboboxField
                name="attendee"
                label="Attendee"
                options={users || []}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="flex-1">
              <ComboboxField
                name="expenseReportId"
                label="Expense Report"
                options={expenseReports || []}
                getOptionLabel={(option) => option.name || ""}
                getOptionValue={(option) => option._id}
                className="w-full"
              />
            </div>
          </div>

          <InputField name="description" label="Description" />
        </form>
      </Form>
    );
  }
);
