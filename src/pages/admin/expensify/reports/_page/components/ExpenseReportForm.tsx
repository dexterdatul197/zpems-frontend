//@ts-nocheck

import { forwardRef, useImperativeHandle } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { ComboboxField } from "@/components/fields/ComboboxField";

import { getUsers } from "@/api/users";

const formSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1), // TODO: better date validation
  attendee: z.string().min(1),
});

interface ExpenseReportFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const ExpenseReportForm = forwardRef(
  ({ initialValues, onSubmit }: ExpenseReportFormProps, ref) => {
    const { authUser } = useRouteLoaderData("root");

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",

        date: initialValues?.date
          ? new Date(initialValues?.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],

        attendee: initialValues?.attendee ?? authUser.id,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

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

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField name="name" label="Report Name" />
          <InputField name="date" label="Date" type="date" />
          <ComboboxField
            name="attendee"
            label="Attendee"
            options={users || []}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            className="w-full"
          />
        </form>
      </Form>
    );
  }
);
