//@ts-nocheck
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { ComboboxField } from "@/components/fields/ComboboxField";
import { useClockifyTrackStore } from "@/pages/admin/clockify/track/_page/zustand/useClockifyTrackStore";

import { getProjects } from "@/api/clockify/projects";

interface TimeEntryFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const TimeEntryForm = forwardRef(
  ({ initialValues, onSubmit }: TimeEntryFormProps, ref) => {
    const { data: projects } = useQuery({
      queryKey: ["clockifyProjects"],
      queryFn: async () => {
        return await getProjects({});
      },
    });

    const formSchema = z.object({
      projectInternalId: z.string().min(1),
      taskInternalId: z.string().min(1),
      date: z.string().min(1), // TODO: better date validation
      duration: z.coerce.number().min(0.001).max(100),
      description: z.string().optional(),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        projectInternalId:
          initialValues?.lineTimesheet?.projectInternalId || "",
        taskInternalId: initialValues?.lineTimesheet?.taskInternalId || "",
        date: initialValues?.date
          ? new Date(initialValues?.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        duration: initialValues?.duration || "",
        description: initialValues?.description || "",
      },
    });

    const projectInternalId = form.watch("projectInternalId");

    const tasks = useMemo(() => {
      let _tasks = [];
      try {
        _tasks =
          projects.find((p) => p.internalId === projectInternalId).tasks || [];
      } catch (e) {}
      return _tasks;
    }, [projects, projectInternalId]);

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ComboboxField
            name="projectInternalId"
            options={projects || []}
            getOptionValue={(option) => option.internalId}
            getOptionLabel={(option) => option.name}
          />
          <ComboboxField
            name="taskInternalId"
            options={tasks}
            getOptionValue={(option) => option.internalId}
            getOptionLabel={(option) => option.name}
          />

          <div className="flex gap-2">
            <InputField
              name="date"
              label="Date"
              type="date"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <InputField name="duration" label="Duration" className="w-full" />
          </div>

          <div className="flex gap-2">
            <TextareaField
              name="description"
              label="Description"
              className="w-full"
            />
          </div>
        </form>
      </Form>
    );
  }
);
