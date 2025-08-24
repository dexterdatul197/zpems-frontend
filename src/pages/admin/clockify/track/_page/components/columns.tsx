// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon, PencilIcon } from "lucide-react";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/fields/Combobox";

import {
  useClockifyTrackStore,
  getDateForWeekday,
} from "../zustand/useClockifyTrackStore";

import { EDIT_TIME_ENTRY_DESCRIPTION_DIALOG } from "./EditTimeEntryDescriptionDialog";
import { DELETE_CONFIRMATION_DIALOG } from "./DeleteConfirmationDialog";
import { useDialogStore } from "@/zustand/useDialogStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatDate = (date) => moment(date).format("MMM DD");

const ProjectCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { projects, updateLineTimesheetProject } = useClockifyTrackStore();

  const lineTimesheet = table.options.data[index];

  const containerRef = React.useRef(null);
  const initialValue = getValue();

  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Combobox
      value={value}
      containerRef={containerRef}
      onSelect={(value) => {
        setValue(value);
        updateLineTimesheetProject(lineTimesheet, value);
      }}
      options={projects || []}
      getOptionValue={(option) => option.internalId}
      getOptionLabel={(option) => option.name}
      className={lineTimesheet.projectInternalId ? "" : "border-red-500"}
      multipleGroups={true}
      getGroupValue={(option) => option.client?.internalId || "no-client"}
      getGroupLabel={(option) => option.client?.name || "No Client"}
    />
  );
};

const TaskCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { getTasks, updateLineTimesheetTask } = useClockifyTrackStore();

  const lineTimesheet = table.options.data[index];

  const containerRef = React.useRef(null);
  const initialValue = getValue();

  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Combobox
      value={value}
      containerRef={containerRef}
      onSelect={async (value) => {
        setValue(value);
        await updateLineTimesheetTask(lineTimesheet, value);
      }}
      options={getTasks(lineTimesheet.projectInternalId)}
      getOptionValue={(option) => option.internalId}
      getOptionLabel={(option) => option.name}
      className={lineTimesheet.taskInternalId ? "" : "border-red-500"}
    />
  );
};

const TimeEntryCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { openDialog } = useDialogStore();
  const { updateLineTimesheetTimeEntry, weekStartDate } =
    useClockifyTrackStore();

  const ref = React.useRef(null);

  const [error, setError] = React.useState("");

  const lineTimesheet = table.options.data[index];

  const initialValue =
    lineTimesheet.timeEntries?.[getDateForWeekday(id, weekStartDate)]
      ?.duration || "";

  const [value, setValue] = React.useState(initialValue);

  const onBlur = () => {
    setError("");
    if (!value) {
      return;
    }

    if (isNaN(value) || parseFloat(value) <= 0) {
      toast.error("Invalid value");
      setError("Invalid value");
      ref?.current.focus();
      return;
    }

    const date = getDateForWeekday(id, weekStartDate);
    updateLineTimesheetTimeEntry(lineTimesheet, date, {
      duration: value,
    });
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex justify-between gap-[2px]">
      <Input
        ref={ref}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        disabled={
          !lineTimesheet.projectInternalId || !lineTimesheet.taskInternalId
        }
        className={cn("min-w-[60px]", error ? "border-red-500" : "")}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          {
            openDialog(EDIT_TIME_ENTRY_DESCRIPTION_DIALOG, {
              lineTimesheet,
              date: getDateForWeekday(id, weekStartDate),
            });
          }
        }}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <div>Id</div>;
    },
    cell: ({ row }) => {
      return <div>{row.original._id}</div>;
    },
    isVisible: false,
  },
  {
    accessorKey: "rowId",
    header: ({ column }) => {
      return <div>Row Id</div>;
    },
  },

  {
    accessorKey: "projectInternalId",
    header: ({ column }) => {
      return <div className="w-[200px]">Project</div>;
    },
    cell: ProjectCell,
  },
  {
    accessorKey: "taskInternalId",
    header: ({ column }) => {
      return <div className="w-[200px]">Task</div>;
    },
    cell: TaskCell,
  },
  {
    accessorKey: "mon",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Mon
        </div>
      );
    },
    cell: TimeEntryCell,
  },
  {
    accessorKey: "tue",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Tue
        </div>
      );
    },
    cell: TimeEntryCell,
  },
  {
    accessorKey: "wed",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Wed
        </div>
      );
    },
    cell: TimeEntryCell,
  },
  {
    accessorKey: "thu",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Thu
        </div>
      );
    },
    cell: TimeEntryCell,
  },
  {
    accessorKey: "fri",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Fri
        </div>
      );
    },
    cell: TimeEntryCell,
  },/*
  {
    accessorKey: "sat",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Sat
        </div>
      );
    },
    cell: TimeEntryCell,
  },
  {
    accessorKey: "sun",
    header: ({ column }) => {
      const { weekStartDate } = useClockifyTrackStore();

      return (
        <div>
          {formatDate(getDateForWeekday(column.id, weekStartDate))}, Sun
        </div>
      );
    },
    cell: TimeEntryCell,
  },*/
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return <div>Actions</div>;
    },
    cell: ({ row }) => {
      const { openDialog } = useDialogStore();
      return (
        <Button
          variant="icon"
          onClick={() => openDialog(DELETE_CONFIRMATION_DIALOG, row.original)}
        >
          <Trash2Icon />
        </Button>
      );
    },
  },
];
