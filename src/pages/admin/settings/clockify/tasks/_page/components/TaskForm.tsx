//@ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { ComboboxField } from "@/components/fields/ComboboxField";
import { FancyMultiSelectField } from "@/components/fields/FancyMultiSelectField";

import { getClientProjects } from "@/api/clockify/clients";
import { getUsers } from "@/api/users";

interface TaskFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const TaskForm = forwardRef(
  ({ initialValues, onSubmit }: TaskFormProps, ref) => {
    const formSchema = z.object({
      clientInternalId: z.string().min(1),
      projectInternalId: z.string().min(1),
      name: z.string().min(1),
      description: z.string().optional(),
      assigneeIds: z.string().array().optional(),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        clientInternalId: initialValues?.client?.internalId || "",
        projectInternalId: initialValues?.project?.internalId || "",
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        assigneeIds: initialValues?.assigneeIds || [],
      },
    });

    const { data: clients } = useQuery({
      queryKey: ["clockifyClients"],
      queryFn: async () => {
        return await getClientProjects({});
      },
    });

    const { data: users } = useQuery({
      queryKey: ["getUsers"],
      queryFn: async () => {
        const users = await getUsers({});

        const userOptions = users?.map((user) => ({
          value: user.internalId,
          label: user.name,
        }));

        return userOptions;
      },
    });

    const clientInternalId = form.watch("clientInternalId");

    const projects = useMemo(() => {
      let _projects = [];
      try {
        _projects =
          clients.find((c) => c.internalId === clientInternalId).projects || [];
      } catch (e) {}

      return _projects;
    }, [clients, clientInternalId]);

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ComboboxField
            name="clientInternalId"
            label="Client"
            options={clients}
            getOptionValue={(option) => option.internalId}
            getOptionLabel={(option) => option.name}
            onSelect={(value) => {
              form.setValue("clientInternalId", value);
              form.setValue("projectInternalId", "");
            }}
          />
          <ComboboxField
            name="projectInternalId"
            label="Project"
            options={projects || []}
            getOptionValue={(option) => option.internalId}
            getOptionLabel={(option) => option.name}
          />

          <div className="flex gap-2">
            <InputField name="name" label="Name" className="w-full" />
          </div>

          <div className="flex gap-2">
            <TextareaField
              name="description"
              label="Description"
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <FancyMultiSelectField
              name="assigneeIds"
              label="Assignees"
              options={users || []}
              placeholder="Select Assignees"
              className="w-full"
            />
          </div>
        </form>
      </Form>
    );
  }
);
